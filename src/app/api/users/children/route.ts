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

const createChildSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  dateOfBirth: z.string().datetime(),
  allergies: z.string().max(500).optional(),
  medicalNotes: z.string().max(1000).optional(),
  emergencyContact: z.string().max(200).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const children = await prisma.child.findMany({
      where: {
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
      orderBy: { createdAt: 'asc' },
    })

    return createSuccessResponse(children)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'PARENT') {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await parseJsonBody(request)
    const childData = createChildSchema.parse(body)

    // Validate date of birth (not in the future)
    const dateOfBirth = new Date(childData.dateOfBirth)
    if (dateOfBirth > new Date()) {
      return createErrorResponse('Date of birth cannot be in the future', 400)
    }

    // Validate age (not older than 18)
    const age = Math.floor((Date.now() - dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    if (age > 18) {
      return createErrorResponse('Child must be 18 years old or younger', 400)
    }

    const child = await prisma.child.create({
      data: {
        ...childData,
        parentId: session.user.id,
        dateOfBirth,
      },
    })

    return createSuccessResponse(child, 201)
  } catch (error) {
    return handleApiError(error)
  }
}