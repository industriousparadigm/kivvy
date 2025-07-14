import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
} from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await prisma.activitySession.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        activity: {
          include: {
            provider: {
              select: {
                id: true,
                businessName: true,
                businessType: true,
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
          },
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'PENDING'] },
            deletedAt: null,
          },
          select: {
            id: true,
            quantity: true,
            status: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            child: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      return createErrorResponse('Session not found', 404);
    }

    const bookedSpots = session.bookings.reduce(
      (total, booking) => total + booking.quantity,
      0
    );
    const actualAvailableSpots = session.capacity - bookedSpots;

    const response = {
      ...session,
      actualAvailableSpots,
      bookedSpots,
      bookings: session.bookings,
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
