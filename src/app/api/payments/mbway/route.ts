import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseJsonBody,
} from '@/lib/api-utils';
import type { Prisma } from '@prisma/client';

const mbwayStatusSchema = z.object({
  paymentId: z.string().cuid(),
  status: z.enum(['confirmed', 'failed', 'expired'] as const),
  reference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const body = await parseJsonBody(request);
    const { paymentId, status, reference } = mbwayStatusSchema.parse(body);

    // Find the payment
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        paymentMethodType: 'MBWAY',
      },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      return createErrorResponse('Payment not found', 404);
    }

    // Verify user owns this payment
    if (payment.booking.userId !== session.user.id) {
      return createErrorResponse('Access denied', 403);
    }

    switch (status) {
      case 'confirmed':
        // Update payment status
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'SUCCEEDED',
            metadata: {
              ...((payment.metadata as Prisma.JsonObject) || {}),
              confirmedAt: new Date().toISOString(),
              mbwayReference: reference,
            } as Prisma.JsonObject,
          },
        });

        // Update booking status
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'SUCCEEDED',
            paymentId: reference || paymentId,
          },
        });

        // Update session available spots
        await prisma.activitySession.update({
          where: { id: payment.booking.sessionId },
          data: {
            availableSpots: {
              decrement: payment.booking.quantity,
            },
          },
        });

        return createSuccessResponse({
          message: 'Payment confirmed successfully',
          booking: payment.booking,
        });

      case 'failed':
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'FAILED',
            metadata: {
              ...((payment.metadata as Prisma.JsonObject) || {}),
              failedAt: new Date().toISOString(),
              failureReason: 'MBWay payment failed',
            } as Prisma.JsonObject,
          },
        });

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: 'FAILED',
          },
        });

        return createSuccessResponse({
          message: 'Payment failed',
        });

      case 'expired':
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'FAILED',
            metadata: {
              ...((payment.metadata as Prisma.JsonObject) || {}),
              expiredAt: new Date().toISOString(),
              failureReason: 'MBWay payment expired',
            } as Prisma.JsonObject,
          },
        });

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            paymentStatus: 'FAILED',
          },
        });

        return createSuccessResponse({
          message: 'Payment expired',
        });

      default:
        return createErrorResponse('Invalid status', 400);
    }
  } catch (error) {
    return handleApiError(error);
  }
}

// Simulate MBWay status check (in real implementation, this would be called by MBWay webhook)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return createErrorResponse('Payment ID required', 400);
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        paymentMethodType: 'MBWAY',
      },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      return createErrorResponse('Payment not found', 404);
    }

    // Check if payment has expired (15 minutes)
    const metadata = (payment.metadata as Prisma.JsonObject) || {};
    const expiresAt = new Date((metadata?.expiresAt as string) || new Date());
    const isExpired = new Date() > expiresAt;

    return createSuccessResponse({
      paymentId: payment.id,
      status: payment.status,
      reference: metadata?.mbwayReference as string,
      amount: payment.amount,
      currency: payment.currency,
      expiresAt: metadata?.expiresAt as string,
      isExpired,
      booking: payment.booking,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
