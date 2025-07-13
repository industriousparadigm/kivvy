import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseJsonBody,
} from '@/lib/api-utils'

const updateChildSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  dateOfBirth: z.string().datetime().optional(),
  allergies: z.string().max(500).optional(),
  medicalNotes: z.string().max(1000).optional(),
  emergencyContact: z.string().max(200).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const child = await prisma.child.findFirst({
      where: {
        id: params.id,
        parentId: session.user.id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            bookings: {
              where: { deletedAt: null },
            },
          },
        },
      },
    })

    if (!child) {
      return createErrorResponse('Child not found', 404)
    }

    return createSuccessResponse(child)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'PARENT') {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await parseJsonBody(request)
    const childData = updateChildSchema.parse(body)

    // Verify the child belongs to the current user
    const existingChild = await prisma.child.findFirst({
      where: {
        id: params.id,
        parentId: session.user.id,
        deletedAt: null,
      },
    })

    if (!existingChild) {
      return createErrorResponse('Child not found', 404)
    }

    // Validate date of birth if provided
    let dateOfBirth: Date | undefined
    if (childData.dateOfBirth) {
      dateOfBirth = new Date(childData.dateOfBirth)
      if (dateOfBirth > new Date()) {
        return createErrorResponse('Date of birth cannot be in the future', 400)
      }

      // Validate age (not older than 18)
      const age = Math.floor((Date.now() - dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      if (age > 18) {
        return createErrorResponse('Child must be 18 years old or younger', 400)
      }
    }

    const updatedChild = await prisma.child.update({
      where: { id: params.id },
      data: {
        ...childData,
        ...(dateOfBirth && { dateOfBirth }),
      },
    })

    return createSuccessResponse(updatedChild)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'PARENT') {
      return createErrorResponse('Unauthorized', 401)
    }

    // Verify the child belongs to the current user
    const existingChild = await prisma.child.findFirst({
      where: {
        id: params.id,
        parentId: session.user.id,
        deletedAt: null,
      },
    })

    if (!existingChild) {
      return createErrorResponse('Child not found', 404)
    }

    // Check if child has any active bookings
    const activeBookings = await prisma.booking.count({
      where: {
        childId: params.id,
        deletedAt: null,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    })

    if (activeBookings > 0) {
      return createErrorResponse(
        'Cannot delete child with active bookings. Please cancel bookings first.',
        400
      )
    }

    // Soft delete the child
    await prisma.child.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    })

    return createSuccessResponse({ message: 'Child deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}