import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  createPaginationParams,
  parseJsonBody,
} from '@/lib/api-utils'

const createBookingSchema = z.object({
  sessionId: z.string().cuid(),
  childId: z.string().cuid(),
  quantity: z.number().int().min(1).max(10),
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = createPaginationParams(searchParams)
    
    const status = searchParams.get('status')
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    const where: any = {
      userId: session.user.id,
      deletedAt: null,
    }

    if (status) {
      where.status = status
    }

    if (fromDate || toDate) {
      where.session = {
        startTime: {},
      }
      if (fromDate) {
        where.session.startTime.gte = new Date(fromDate)
      }
      if (toDate) {
        where.session.startTime.lte = new Date(toDate)
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          child: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
            },
          },
          session: {
            include: {
              activity: {
                select: {
                  id: true,
                  title: true,
                  imageUrl: true,
                  duration: true,
                  category: true,
                  provider: {
                    select: {
                      id: true,
                      businessName: true,
                      address: true,
                      city: true,
                    },
                  },
                },
              },
            },
          },
          payment: {
            select: {
              id: true,
              status: true,
              amount: true,
              currency: true,
              paymentMethodType: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return createSuccessResponse({
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await parseJsonBody(request)
    const { sessionId, childId, quantity, notes } = createBookingSchema.parse(body)

    // Verify child belongs to user
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId: session.user.id,
        deletedAt: null,
      },
    })

    if (!child) {
      return createErrorResponse('Child not found', 404)
    }

    // Get session with activity details
    const activitySession = await prisma.activitySession.findUnique({
      where: {
        id: sessionId,
        deletedAt: null,
        status: 'SCHEDULED',
        startTime: { gte: new Date() }, // Can't book past sessions
      },
      include: {
        activity: {
          select: {
            id: true,
            title: true,
            price: true,
            ageMin: true,
            ageMax: true,
          },
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            deletedAt: null,
          },
          select: {
            quantity: true,
          },
        },
      },
    })

    if (!activitySession) {
      return createErrorResponse('Session not found or not available', 404)
    }

    // Check child age eligibility
    const childAge = Math.floor(
      (Date.now() - child.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    )

    if (childAge < activitySession.activity.ageMin || childAge > activitySession.activity.ageMax) {
      return createErrorResponse(
        `Child age (${childAge}) is not within the required range (${activitySession.activity.ageMin}-${activitySession.activity.ageMax})`,
        400
      )
    }

    // Check availability
    const bookedSpots = activitySession.bookings.reduce((total, booking) => total + booking.quantity, 0)
    const availableSpots = activitySession.capacity - bookedSpots

    if (quantity > availableSpots) {
      return createErrorResponse(
        `Not enough spots available. Requested: ${quantity}, Available: ${availableSpots}`,
        400
      )
    }

    // Check for duplicate booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        childId,
        sessionId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        deletedAt: null,
      },
    })

    if (existingBooking) {
      return createErrorResponse('Booking already exists for this child and session', 400)
    }

    // Calculate total amount
    const sessionPrice = activitySession.price || activitySession.activity.price
    const totalAmount = sessionPrice * quantity

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        childId,
        sessionId,
        quantity,
        totalAmount,
        currency: 'EUR',
        status: 'PENDING',
        paymentStatus: 'PENDING',
        notes,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        session: {
          include: {
            activity: {
              select: {
                id: true,
                title: true,
                provider: {
                  select: {
                    businessName: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return createSuccessResponse(booking, 201)
  } catch (error) {
    return handleApiError(error)
  }
}