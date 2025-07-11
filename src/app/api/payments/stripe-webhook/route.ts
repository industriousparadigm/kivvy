import { NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import PaymentService from '@/lib/payment-service'
import { prisma } from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return createErrorResponse('Missing stripe-signature header', 400)
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return createErrorResponse('Invalid signature', 400)
    }

    console.log('Received Stripe webhook:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object)
        break

      case 'charge.dispute.created':
        await handleChargeDisputeCreated(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return createSuccessResponse({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return createErrorResponse('Webhook processing failed', 500)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata } = paymentIntent

    console.log('Payment succeeded:', paymentIntentId)

    // Update payment record
    const payment = await prisma.payment.findFirst({
      where: { paymentIntentId },
    })

    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntentId)
      return
    }

    // Confirm payment using payment service
    await PaymentService.confirmPayment(paymentIntentId)

    // Here you could add:
    // - Send confirmation email
    // - Send SMS notification
    // - Update analytics
    // - Trigger other business logic

    console.log('Payment confirmation completed for booking:', metadata.bookingId)
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    const { id: paymentIntentId, last_payment_error, metadata } = paymentIntent

    console.log('Payment failed:', paymentIntentId, last_payment_error?.message)

    // Update payment status
    await prisma.payment.updateMany({
      where: { paymentIntentId },
      data: {
        status: 'FAILED',
        metadata: {
          failureReason: last_payment_error?.message || 'Unknown error',
          failedAt: new Date().toISOString(),
        },
      },
    })

    // Update booking status
    await prisma.booking.updateMany({
      where: { id: metadata.bookingId },
      data: {
        paymentStatus: 'FAILED',
      },
    })

    // Here you could add:
    // - Send failure notification email
    // - Log for analytics
    // - Trigger retry logic

  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata } = paymentIntent

    console.log('Payment canceled:', paymentIntentId)

    // Update payment status
    await prisma.payment.updateMany({
      where: { paymentIntentId },
      data: {
        status: 'FAILED',
        metadata: {
          canceledAt: new Date().toISOString(),
          reason: 'Payment intent canceled',
        },
      },
    })

    // Update booking status
    await prisma.booking.updateMany({
      where: { id: metadata.bookingId },
      data: {
        paymentStatus: 'FAILED',
      },
    })

  } catch (error) {
    console.error('Error handling payment intent canceled:', error)
  }
}

async function handleChargeDisputeCreated(dispute: any) {
  try {
    const { id: disputeId, payment_intent: paymentIntentId, reason, amount } = dispute

    console.log('Charge dispute created:', disputeId, 'for payment:', paymentIntentId)

    // Find the payment
    const payment = await prisma.payment.findFirst({
      where: { paymentIntentId },
      include: { booking: true },
    })

    if (!payment) {
      console.error('Payment not found for dispute:', disputeId)
      return
    }

    // Update payment metadata
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        metadata: {
          ...(payment.metadata as any || {}),
          disputeId,
          disputeReason: reason,
          disputeAmount: amount,
          disputeCreatedAt: new Date().toISOString(),
        } as any,
      },
    })

    // Here you could add:
    // - Send notification to admin
    // - Flag the booking/user
    // - Start dispute resolution process

  } catch (error) {
    console.error('Error handling charge dispute:', error)
  }
}