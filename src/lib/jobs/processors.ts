import Queue from 'bull';
import { JobData } from '@/lib/queue';
import { emailService } from '@/lib/email';
import { smsService } from '@/lib/sms';
import { pushNotificationService } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';
import type {
  Booking,
  Payment,
  User,
  Activity,
  ActivitySession,
  Prisma,
} from '@prisma/client';

type BookingWithRelations = Booking & {
  payment: Payment | null;
  user: User;
  session: ActivitySession & {
    activity: Activity;
  };
};

interface ReportPayload {
  type: string;
  period: string;
  providerId?: string;
  date?: string;
}

// Email job processor
export const processEmailJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing email job', { jobId: job.id, payload });

    await emailService.sendEmail({
      to: payload.to as string,
      subject: payload.subject as string,
      template: payload.template as string,
      context: (payload.context as Record<string, unknown>) || {},
    });

    logger.info('Email job completed successfully', { jobId: job.id });
  } catch (error) {
    logger.error('Email job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// SMS job processor
export const processSMSJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing SMS job', { jobId: job.id, payload });

    await smsService.sendSMS({
      to: payload.phoneNumber as string,
      message: payload.message as string,
    });

    logger.info('SMS job completed successfully', { jobId: job.id });
  } catch (error) {
    logger.error('SMS job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Push notification job processor
export const processPushNotificationJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing push notification job', { jobId: job.id, payload });

    await pushNotificationService.sendNotification({
      userId: payload.userId as string,
      title: payload.title as string,
      message: payload.message as string,
      data: payload.data as Record<string, unknown>,
    });

    logger.info('Push notification job completed successfully', {
      jobId: job.id,
    });
  } catch (error) {
    logger.error('Push notification job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Payment job processor
export const processPaymentJob = async (job: Queue.Job<JobData>) => {
  const { payload, bookingId } = job.data;

  try {
    logger.info('Processing payment job', {
      jobId: job.id,
      payload,
      bookingId,
    });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        user: true,
        session: {
          include: {
            activity: true,
          },
        },
      },
    });

    if (!booking) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

    switch (payload.action) {
      case 'process':
        await processPaymentCapture(booking);
        break;
      case 'refund':
        await processPaymentRefund(
          booking,
          payload.amount as number,
          payload.reason as string
        );
        break;
      case 'capture':
        await processPaymentCapture(booking);
        break;
      default:
        throw new Error(`Unknown payment action: ${payload.action}`);
    }

    logger.info('Payment job completed successfully', {
      jobId: job.id,
      bookingId,
    });
  } catch (error) {
    logger.error('Payment job failed', {
      jobId: job.id,
      bookingId,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Helper functions for payment processing
async function processPaymentCapture(booking: BookingWithRelations) {
  if (!booking.payment?.stripePaymentIntentId) {
    throw new Error('No payment intent found for booking');
  }

  await stripe.paymentIntents.capture(booking.payment.stripePaymentIntentId);

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      status: 'SUCCEEDED',
      capturedAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CONFIRMED' },
  });
}

async function processPaymentRefund(
  booking: BookingWithRelations,
  amount?: number,
  reason?: string
) {
  if (!booking.payment?.stripePaymentIntentId) {
    throw new Error('No payment intent found for booking');
  }

  const refundData: {
    payment_intent: string;
    reason: string;
    amount?: number;
  } = {
    payment_intent: booking.payment.stripePaymentIntentId,
    reason: reason || 'requested_by_customer',
  };

  if (amount) {
    refundData.amount = Math.round(amount * 100); // Convert to cents
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await stripe.refunds.create(refundData as any);

  await prisma.payment.update({
    where: { id: booking.payment.id },
    data: {
      status: 'REFUNDED',
      refundedAt: new Date(),
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: 'CANCELLED' },
  });
}

// Report generation job processor
export const processReportJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing report job', { jobId: job.id, payload });

    let reportData;

    switch (payload.type) {
      case 'activity-stats':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reportData = await generateActivityStatsReport(payload as any);
        break;
      case 'revenue-report':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reportData = await generateRevenueReport(payload as any);
        break;
      case 'user-engagement':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reportData = await generateUserEngagementReport(payload as any);
        break;
      default:
        throw new Error(`Unknown report type: ${payload.type}`);
    }

    // Store report in database
    await prisma.report.create({
      data: {
        type: payload.type as string,
        period: payload.period as string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: reportData as any,
        generatedAt: new Date(),
        providerId: payload.providerId as string,
      },
    });

    logger.info('Report job completed successfully', { jobId: job.id });
  } catch (error) {
    logger.error('Report job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Report generation helper functions
async function generateActivityStatsReport(payload: ReportPayload) {
  const whereClause: Prisma.ActivityWhereInput = {};

  if (payload.providerId) {
    whereClause.providerId = payload.providerId as string;
  }

  if (payload.date) {
    const date = new Date(payload.date as string);
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    whereClause.createdAt = {
      gte: startDate,
      lt: endDate,
    };
  }

  const [totalActivities, totalBookings, totalRevenue] = await Promise.all([
    prisma.activity.count({ where: whereClause }),
    prisma.booking.count({
      where: {
        ...(whereClause as Record<string, unknown>),
        status: 'CONFIRMED',
      },
    }),
    prisma.payment.aggregate({
      where: {
        ...(whereClause as Record<string, unknown>),
        status: 'SUCCEEDED',
      },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalActivities,
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    period: payload.period,
    generatedAt: new Date(),
  };
}

async function generateRevenueReport(payload: ReportPayload) {
  const whereClause: Prisma.PaymentWhereInput = { status: 'SUCCEEDED' };

  if (payload.providerId) {
    whereClause.booking = {
      session: {
        activity: {
          providerId: payload.providerId as string,
        },
      },
    };
  }

  const payments = await prisma.payment.findMany({
    where: whereClause,
    include: {
      booking: {
        include: {
          session: {
            include: {
              activity: true,
            },
          },
        },
      },
    },
  });

  const revenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );
  const bookingsCount = payments.length;

  return {
    totalRevenue: revenue,
    totalBookings: bookingsCount,
    averageOrderValue: bookingsCount > 0 ? revenue / bookingsCount : 0,
    period: payload.period,
    generatedAt: new Date(),
  };
}

async function generateUserEngagementReport(payload: ReportPayload) {
  const [totalUsers, activeUsers, newUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        bookings: {
          some: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    newUsers,
    engagementRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    period: payload.period,
    generatedAt: new Date(),
  };
}

// Maintenance job processor
export const processMaintenanceJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing maintenance job', { jobId: job.id, payload });

    switch (payload.task) {
      case 'cleanup-sessions':
        await cleanupExpiredSessions();
        break;
      case 'sync-data':
        await syncExternalData();
        break;
      case 'update-stats':
        await updateActivityStats();
        break;
      default:
        throw new Error(`Unknown maintenance task: ${payload.task}`);
    }

    logger.info('Maintenance job completed successfully', { jobId: job.id });
  } catch (error) {
    logger.error('Maintenance job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

// Maintenance helper functions
async function cleanupExpiredSessions() {
  const expiredDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

  const result = await prisma.session.deleteMany({
    where: {
      expires: {
        lt: expiredDate,
      },
    },
  });

  logger.info(`Cleaned up ${result.count} expired sessions`);
}

async function syncExternalData() {
  // Placeholder for external data synchronization
  // This could include syncing with payment providers, analytics services, etc.
  logger.info('External data sync completed');
}

async function updateActivityStats() {
  // Update activity view counts, ratings, etc.
  const activities = await prisma.activity.findMany({
    include: {
      sessions: {
        include: {
          bookings: true,
        },
      },
      reviews: true,
    },
  });

  for (const activity of activities) {
    const totalBookings = activity.sessions.reduce(
      (sum, session) => sum + session.bookings.length,
      0
    );
    const totalReviews = activity.reviews.length;
    const averageRating =
      totalReviews > 0
        ? activity.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    await prisma.activity.update({
      where: { id: activity.id },
      data: {
        totalBookings,
        totalReviews,
        averageRating,
      },
    });
  }

  logger.info(`Updated stats for ${activities.length} activities`);
}

// Booking reminder job processor
export const processBookingReminderJob = async (job: Queue.Job<JobData>) => {
  const { payload } = job.data;

  try {
    logger.info('Processing booking reminder job', { jobId: job.id, payload });

    // Find bookings that need reminders
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        status: 'CONFIRMED',
        session: {
          startTime: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        user: true,
        session: {
          include: {
            activity: true,
          },
        },
      },
    });

    // Send reminders
    for (const booking of bookings) {
      await emailService.sendEmail({
        to: booking.user.email,
        subject: 'Lembrete: Atividade amanhã',
        template: 'booking-reminder',
        context: {
          userName: booking.user.name,
          activityTitle: booking.session.activity.title,
          sessionDate: booking.session.startTime,
          location: booking.session.activity.location,
        },
      });
    }

    logger.info(`Sent ${bookings.length} booking reminders`);
  } catch (error) {
    logger.error('Booking reminder job failed', {
      jobId: job.id,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
