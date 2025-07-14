import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseJsonBody,
} from '@/lib/api-utils';

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            allergies: true,
            medicalNotes: true,
            emergencyContact: true,
          },
        },
        session: {
          include: {
            activity: {
              include: {
                provider: {
                  select: {
                    id: true,
                    userId: true,
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
          },
        },
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      return createErrorResponse('Booking not found', 404);
    }

    // Check if user owns this booking or is the provider/admin
    const isOwner = booking.userId === session.user.id;
    const isProvider =
      session.user.role === 'PROVIDER' &&
      booking.session.activity.provider.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isProvider && !isAdmin) {
      return createErrorResponse('Access denied', 403);
    }

    return createSuccessResponse(booking);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await parseJsonBody(request);
    const { status, notes } = updateBookingSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        session: {
          include: {
            activity: {
              include: {
                provider: {
                  select: {
                    id: true,
                    userId: true,
                    businessName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return createErrorResponse('Booking not found', 404);
    }

    // Check permissions
    const isOwner = booking.userId === session.user.id;
    const isProvider =
      session.user.role === 'PROVIDER' &&
      booking.session.activity.provider.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isProvider && !isAdmin) {
      return createErrorResponse('Access denied', 403);
    }

    // Only allow certain status transitions
    if (status) {
      const allowedTransitions: Record<string, string[]> = {
        PENDING: ['CONFIRMED', 'CANCELLED'],
        CONFIRMED: ['CANCELLED', 'COMPLETED', 'NO_SHOW'],
        CANCELLED: [], // Cannot change from cancelled
        COMPLETED: [], // Cannot change from completed
        NO_SHOW: [], // Cannot change from no show
      };

      if (!allowedTransitions[booking.status]?.includes(status)) {
        return createErrorResponse(
          `Cannot change status from ${booking.status} to ${status}`,
          400
        );
      }

      // Only providers/admins can mark as completed or no-show
      if (
        ['COMPLETED', 'NO_SHOW'].includes(status) &&
        !isProvider &&
        !isAdmin
      ) {
        return createErrorResponse(
          'Only providers can mark bookings as completed or no-show',
          403
        );
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date(),
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
        payment: true,
      },
    });

    return createSuccessResponse(updatedBooking);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        session: {
          include: {
            activity: {
              include: {
                provider: {
                  select: {
                    id: true,
                    userId: true,
                    businessName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return createErrorResponse('Booking not found', 404);
    }

    // Check permissions
    const isOwner = booking.userId === session.user.id;
    const isProvider =
      session.user.role === 'PROVIDER' &&
      booking.session.activity.provider.userId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isProvider && !isAdmin) {
      return createErrorResponse('Access denied', 403);
    }

    // Can only delete pending bookings or cancel confirmed ones
    if (booking.status === 'COMPLETED' || booking.status === 'NO_SHOW') {
      return createErrorResponse(
        'Cannot delete completed or no-show bookings',
        400
      );
    }

    // Check if session is too close (e.g., less than 24 hours away)
    const hoursUntilSession =
      (booking.session.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilSession < 24 && booking.status === 'CONFIRMED') {
      return createErrorResponse(
        'Cannot cancel confirmed booking less than 24 hours before session',
        400
      );
    }

    // Soft delete the booking
    await prisma.booking.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'CANCELLED',
      },
    });

    return createSuccessResponse({ message: 'Booking cancelled successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
