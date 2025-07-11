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

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  dateOfBirth: z.string().datetime().optional(),
  language: z.enum(['pt', 'en'] as const).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        childProfiles: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
        provider: true,
        _count: {
          select: {
            bookings: {
              where: { deletedAt: null },
            },
            savedActivities: true,
          },
        },
      },
    })

    if (!user) {
      return createErrorResponse('User not found', 404)
    }

    const { password, ...userWithoutPassword } = user

    return createSuccessResponse(userWithoutPassword)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await parseJsonBody(request)
    const profileData = updateProfileSchema.parse(body)

    // Update user profile
    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...profileData,
        ...(profileData.dateOfBirth && { 
          dateOfBirth: new Date(profileData.dateOfBirth) 
        }),
      },
      update: {
        ...profileData,
        ...(profileData.dateOfBirth && { 
          dateOfBirth: new Date(profileData.dateOfBirth) 
        }),
      },
    })

    return createSuccessResponse(updatedProfile)
  } catch (error) {
    return handleApiError(error)
  }
}