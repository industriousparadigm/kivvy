import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createSuccessResponse,
  handleApiError,
  createPaginationParams,
  createFilterParams,
} from '@/lib/api-utils';
import { logger } from '@/lib/logger';

async function getActivitiesHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = createPaginationParams(searchParams);
    const filters = createFilterParams(searchParams);

    logger.info('Activities request', {
      filters,
      pagination: { page, limit },
      type: 'api-request',
    });

    // Build where clause for filtering
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search } },
      ];
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters.ageMin || filters.ageMax) {
      where.AND = [];
      if (filters.ageMin) {
        where.AND.push({ ageMax: { gte: filters.ageMin } });
      }
      if (filters.ageMax) {
        where.AND.push({ ageMin: { lte: filters.ageMax } });
      }
    }

    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) {
        where.price.gte = filters.priceMin;
      }
      if (filters.priceMax) {
        where.price.lte = filters.priceMax;
      }
    }

    if (filters.language) {
      where.language = filters.language;
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty;
    }

    // Get activities with provider info and upcoming sessions
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              city: true,
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
              availableSpots: true,
              capacity: true,
              price: true,
            },
            orderBy: {
              startTime: 'asc',
            },
            take: 5, // Only next 5 sessions
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              savedBy: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);

    // Calculate average rating for each activity
    const activitiesWithRating = activities.map(activity => ({
      ...activity,
      averageRating:
        activity.reviews.length > 0
          ? activity.reviews.reduce((sum, review) => sum + review.rating, 0) /
            activity.reviews.length
          : null,
      reviewCount: activity.reviews.length,
      nextSessions: activity.sessions,
      savedCount: activity._count.savedBy,
    }));

    const totalPages = Math.ceil(total / limit);

    logger.info('Activities request completed', {
      resultCount: activitiesWithRating.length,
      total,
      page,
      type: 'api-response',
    });

    return createSuccessResponse({
      activities: activitiesWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    logger.error('Activities request failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'api-error',
    });
    return handleApiError(error);
  }
}

export const GET = getActivitiesHandler;
