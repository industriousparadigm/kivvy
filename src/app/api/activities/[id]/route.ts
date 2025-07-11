import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse, handleApiError } from '@/lib/api-utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const activity = await prisma.activity.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            description: true,
            address: true,
            city: true,
            postalCode: true,
            country: true,
            latitude: true,
            longitude: true,
            phone: true,
            email: true,
            website: true,
            isVerified: true,
          },
        },
        sessions: {
          where: {
            startTime: { gte: new Date() },
            status: 'SCHEDULED',
            deletedAt: null,
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            capacity: true,
            availableSpots: true,
            price: true,
            status: true,
            notes: true,
          },
          orderBy: {
            startTime: 'asc',
          },
        },
        reviews: {
          where: {
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Latest 10 reviews
        },
        _count: {
          select: {
            savedBy: true,
            reviews: true,
          },
        },
      },
    })

    if (!activity) {
      return createErrorResponse('Activity not found', 404)
    }

    // Calculate average rating
    const averageRating = activity.reviews.length > 0
      ? activity.reviews.reduce((sum, review) => sum + review.rating, 0) / activity.reviews.length
      : null

    // Format the response
    const response = {
      ...activity,
      averageRating,
      reviewCount: activity._count.reviews,
      savedCount: activity._count.savedBy,
      upcomingSessions: activity.sessions,
      recentReviews: activity.reviews,
    }

    return createSuccessResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}