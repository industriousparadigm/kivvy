import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import PaymentService from '@/lib/payment-service';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseJsonBody,
} from '@/lib/api-utils';

const refundSchema = z.object({
  bookingId: z.string().cuid(),
  amount: z.number().positive().optional(),
  reason: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await parseJsonBody(request);
    const { bookingId, amount, reason } = refundSchema.parse(body);

    // Find the booking and payment
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        deletedAt: null,
      },
      include: {
        payment: true,
        session: {
          include: {
            activity: {
              include: {
                provider: true,
              },
            },
          },
        },
        user: true,
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

    // Check if booking can be refunded
    if (!booking.payment) {
      return createErrorResponse('No payment found for this booking', 400);
    }

    if (booking.payment.status !== 'SUCCEEDED') {
      return createErrorResponse(
        'Payment must be completed to issue refund',
        400
      );
    }

    if (booking.status === 'CANCELLED') {
      return createErrorResponse('Booking is already cancelled', 400);
    }

    // Check refund policy (e.g., 24 hours before session)
    const hoursUntilSession =
      (booking.session.startTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilSession < 24 && !isProvider && !isAdmin) {
      return createErrorResponse(
        'Refunds are only allowed up to 24 hours before the session starts',
        400
      );
    }

    // Validate refund amount
    const maxRefundAmount =
      booking.payment.amount - (booking.payment.refundAmount || 0);
    const refundAmount = amount || maxRefundAmount;

    if (refundAmount > maxRefundAmount) {
      return createErrorResponse(
        `Refund amount cannot exceed ${maxRefundAmount} EUR`,
        400
      );
    }

    // Process refund
    if (booking.payment.paymentMethodType === 'MBWAY') {
      // MBWay refunds would need to be handled manually or through their API
      // For now, we'll just update the database
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          status:
            refundAmount >= booking.payment.amount
              ? 'REFUNDED'
              : 'PARTIALLY_REFUNDED',
          refundAmount: (booking.payment.refundAmount || 0) + refundAmount,
          refundReason: reason || 'Customer request',
          metadata: {
            ...((booking.payment.metadata as any) || {}),
            mbwayRefundProcessedAt: new Date().toISOString(),
            mbwayRefundMethod: 'manual',
          } as any,
        },
      });

      // Update booking status
      if (refundAmount >= booking.payment.amount) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CANCELLED',
            paymentStatus: 'REFUNDED',
          },
        });

        // Restore available spots
        await prisma.activitySession.update({
          where: { id: booking.session.id },
          data: {
            availableSpots: {
              increment: booking.quantity,
            },
          },
        });
      }

      return createSuccessResponse({
        message:
          'MBWay refund processed. Customer will receive refund via bank transfer within 3-5 business days.',
        refundAmount,
        currency: booking.payment.currency,
      });
    } else {
      // Stripe refund
      if (!booking.payment.stripePaymentIntentId) {
        return createErrorResponse('Payment intent ID not found', 400);
      }

      await PaymentService.refundPayment(
        booking.payment.stripePaymentIntentId,
        refundAmount,
        reason
      );

      return createSuccessResponse({
        message: 'Refund processed successfully',
        refundAmount,
        currency: booking.payment.currency,
      });
    }
  } catch (error) {
    return handleApiError(error);
  }
}
