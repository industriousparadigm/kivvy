import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  createPaginationParams,
  parseJsonBody,
} from '@/lib/api-utils';

const createActivitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  shortDescription: z.string().max(200).optional(),
  category: z.enum([
    'SPORTS',
    'ARTS_CRAFTS',
    'MUSIC',
    'DANCE',
    'EDUCATION',
    'SCIENCE',
    'TECHNOLOGY',
    'COOKING',
    'LANGUAGES',
    'OUTDOOR',
    'SWIMMING',
    'MARTIAL_ARTS',
    'THEATER',
    'OTHER',
  ]),
  ageMin: z.number().int().min(0).max(18),
  ageMax: z.number().int().min(0).max(18),
  capacity: z.number().int().min(1).max(100),
  price: z.number().min(0),
  duration: z.number().int().min(15).max(480), // 15 minutes to 8 hours
  language: z.string().default('pt'),
  difficulty: z
    .enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .default('BEGINNER'),
  location: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  requirements: z.string().max(1000).optional(),
  included: z.string().max(1000).optional(),
  notIncluded: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== 'PROVIDER' && session.user.role !== 'ADMIN')
    ) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = createPaginationParams(searchParams);

    // Get provider ID
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider && session.user.role !== 'ADMIN') {
      return createErrorResponse('Provider profile not found', 404);
    }

    const where: {
      deletedAt: null;
      providerId?: string;
    } = {
      deletedAt: null,
    };

    if (provider) {
      where.providerId = provider.id;
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              businessName: true,
              city: true,
            },
          },
          sessions: {
            where: {
              startTime: { gte: new Date() },
              deletedAt: null,
            },
            select: {
              id: true,
              startTime: true,
              endTime: true,
              capacity: true,
              availableSpots: true,
              status: true,
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
            orderBy: { startTime: 'asc' },
            take: 5,
          },
          _count: {
            select: {
              sessions: true,
              reviews: true,
              savedBy: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.activity.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return createSuccessResponse({
      activities,
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'PROVIDER') {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await parseJsonBody(request);
    const activityData = createActivitySchema.parse(body);

    // Get provider
    const provider = await prisma.provider.findUnique({
      where: { userId: session.user.id },
    });

    if (!provider) {
      return createErrorResponse('Provider profile not found', 404);
    }

    if (!provider.isActive || !provider.isVerified) {
      return createErrorResponse(
        'Provider account must be active and verified',
        403
      );
    }

    // Validate age range
    if (activityData.ageMin > activityData.ageMax) {
      return createErrorResponse(
        'Minimum age cannot be greater than maximum age',
        400
      );
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        ...activityData,
        providerId: provider.id,
        // Use provider location if not specified
        address: activityData.address || provider.address,
        city: activityData.city || provider.city,
        postalCode: activityData.postalCode || provider.postalCode,
        latitude: activityData.latitude || provider.latitude,
        longitude: activityData.longitude || provider.longitude,
      },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            city: true,
          },
        },
      },
    });

    return createSuccessResponse(activity, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
