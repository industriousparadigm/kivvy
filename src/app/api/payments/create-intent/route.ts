import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import PaymentService from '@/lib/payment-service'
import {
  createSuccessResponse,
  createErrorResponse,
  handleApiError,
  parseJsonBody,
} from '@/lib/api-utils'

const createPaymentIntentSchema = z.object({
  bookingId: z.string().cuid(),
  paymentMethod: z.enum(['STRIPE_CARD', 'STRIPE_SEPA', 'MBWAY']),
  metadata: z.record(z.string(), z.string()).default({}),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return createErrorResponse('Unauthorized', 401)
    }

    const body = await parseJsonBody(request)
    const { bookingId, paymentMethod, metadata = {} } = createPaymentIntentSchema.parse(body)

    // Verify booking belongs to user
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: session.user.id,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        deletedAt: null,
      },
      include: {
        session: {
          include: {
            activity: true,
          },
        },
      },
    })

    if (!booking) {
      return createErrorResponse('Booking not found or not eligible for payment', 404)
    }

    // Check if session is still available and not in the past
    if (booking.session.startTime <= new Date()) {
      return createErrorResponse('Cannot pay for sessions that have already started', 400)
    }

    const paymentRequest = {
      bookingId,
      amount: booking.totalAmount,
      currency: booking.currency,
      paymentMethodType: paymentMethod,
      metadata: {
        userId: session.user.id,
        activityTitle: booking.session.activity.title,
        ...metadata,
      },
    }

    let result

    if (paymentMethod === 'MBWAY') {
      result = await PaymentService.handleMBWayPayment(paymentRequest)
    } else {
      result = await PaymentService.createPaymentIntent(paymentRequest)
    }

    return createSuccessResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}