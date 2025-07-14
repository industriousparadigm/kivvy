import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createSuccessResponse,
  handleApiError,
  createPaginationParams,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = createPaginationParams(searchParams);

    const activityId = searchParams.get('activityId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: {
      deletedAt: null;
      status: 'SCHEDULED';
      activityId?: string;
      startTime?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      deletedAt: null,
      status: 'SCHEDULED',
    };

    if (activityId) {
      where.activityId = activityId;
    }

    if (from || to) {
      where.startTime = {};
      if (from) {
        where.startTime.gte = new Date(from);
      }
      if (to) {
        where.startTime.lte = new Date(to);
      }
    } else {
      // Default: only future sessions
      where.startTime = { gte: new Date() };
    }

    const [sessions, total] = await Promise.all([
      prisma.activitySession.findMany({
        where,
        include: {
          activity: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              price: true,
              duration: true,
              category: true,
              provider: {
                select: {
                  id: true,
                  businessName: true,
                  city: true,
                },
              },
            },
          },
          _count: {
            select: {
              bookings: {
                where: {
                  status: { in: ['CONFIRMED', 'PENDING'] },
                  deletedAt: null,
                },
              },
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.activitySession.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse({
      sessions,
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
    return handleApiError(error);
  }
}
