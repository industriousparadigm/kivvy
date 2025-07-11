import { stripe, calculatePlatformFee, calculateNetAmount } from './stripe'
import { prisma } from './prisma'
import { PaymentMethod, PaymentStatus } from '@prisma/client'

export interface CreatePaymentIntentRequest {
  bookingId: string
  amount: number
  currency?: string
  paymentMethodType: PaymentMethod
  metadata?: Record<string, string>
}

export interface CreatePaymentIntentResponse {
  paymentIntentId: string
  clientSecret: string
  publishableKey: string
  amount: number
  currency: string
}

export class PaymentService {
  static async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<CreatePaymentIntentResponse> {
    const { bookingId, amount, currency = 'EUR', paymentMethodType, metadata = {} } = request

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
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
        child: true,
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (booking.paymentStatus !== 'PENDING') {
      throw new Error('Booking payment is not in pending state')
    }

    const platformFee = calculatePlatformFee(amount)
    const netAmount = calculateNetAmount(amount)

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: undefined, // We could create/link Stripe customers here
      payment_method_types: paymentMethodType === 'STRIPE_CARD' ? ['card'] : ['sepa_debit'],
      metadata: {
        bookingId,
        providerId: booking.session.activity.provider.id,
        activityId: booking.session.activity.id,
        sessionId: booking.session.id,
        childId: booking.childId,
        userId: booking.userId,
        platformFee: platformFee.toString(),
        netAmount: netAmount.toString(),
        ...metadata,
      },
      description: `KidsHiz - ${booking.session.activity.title} for ${booking.child.firstName}`,
      statement_descriptor: 'KIDSHIZ',
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId,
        paymentIntentId: paymentIntent.id,
        paymentMethodType,
        amount,
        currency: currency.toUpperCase(),
        status: 'PENDING',
        providerFee: platformFee,
        netAmount,
        metadata: {
          stripePaymentIntentId: paymentIntent.id,
          stripeFee: 0, // Will be updated after webhook
          ...metadata,
        },
      },
    })

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
      amount,
      currency: currency.toUpperCase(),
    }
  }

  static async handleMBWayPayment(request: CreatePaymentIntentRequest): Promise<any> {
    // MBWay integration would go here
    // For now, we'll simulate the process
    const { bookingId, amount, currency = 'EUR', metadata = {} } = request

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
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
        child: true,
      },
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    const platformFee = calculatePlatformFee(amount)
    const netAmount = calculateNetAmount(amount)

    // Create payment record for MBWay
    const payment = await prisma.payment.create({
      data: {
        bookingId,
        paymentMethodType: 'MBWAY',
        amount,
        currency: currency.toUpperCase(),
        status: 'PENDING',
        providerFee: platformFee,
        netAmount,
        metadata: {
          mbwayReference: this.generateMBWayReference(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          ...metadata,
        } as any,
      },
    })

    return {
      paymentId: payment.id,
      mbwayReference: (payment.metadata as any)?.mbwayReference,
      amount,
      currency: currency.toUpperCase(),
      expiresAt: (payment.metadata as any)?.expiresAt,
      instructions: 'Abra a aplicação MB WAY e introduza a referência acima',
    }
  }

  static async confirmPayment(paymentIntentId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { paymentIntentId },
      include: { booking: true },
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'COMPLETED' },
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        paymentId: paymentIntentId,
      },
    })

    // Update session available spots
    await prisma.activitySession.update({
      where: { id: payment.booking.sessionId },
      data: {
        availableSpots: {
          decrement: payment.booking.quantity,
        },
      },
    })
  }

  static async refundPayment(paymentIntentId: string, amount?: number, reason?: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { paymentIntentId },
      include: { booking: true },
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    const refundAmount = amount || payment.amount

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        bookingId: payment.bookingId,
        reason: reason || 'Customer request',
      },
    })

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: refundAmount >= payment.amount ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        refundAmount,
        refundReason: reason,
        metadata: {
          ...(payment.metadata as any || {}),
          refundId: refund.id,
          refundedAt: new Date().toISOString(),
        } as any,
      },
    })

    // Update booking status if fully refunded
    if (refundAmount >= payment.amount) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: 'CANCELLED',
          paymentStatus: 'REFUNDED',
        },
      })

      // Restore session available spots
      await prisma.activitySession.update({
        where: { id: payment.booking.sessionId },
        data: {
          availableSpots: {
            increment: payment.booking.quantity,
          },
        },
      })
    }
  }

  private static generateMBWayReference(): string {
    // Generate a 9-digit reference for MBWay
    return Math.random().toString().substr(2, 9)
  }
}

export default PaymentService