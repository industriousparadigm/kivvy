import {
  emailQueue,
  notificationQueue,
  paymentQueue,
  reportQueue,
  maintenanceQueue,
} from '@/lib/queue';
import {
  processEmailJob,
  processSMSJob,
  processPushNotificationJob,
  processPaymentJob,
  processReportJob,
  processMaintenanceJob,
  processBookingReminderJob,
} from './processors';
import { logger } from '@/lib/logger';

// Configure job processors
export function initializeWorkers() {
  logger.info('Initializing job workers...');

  // Email queue processors
  emailQueue().process('send-email', 5, processEmailJob);

  // Notification queue processors
  notificationQueue().process('send-sms', 3, processSMSJob);
  notificationQueue().process(
    'send-push-notification',
    10,
    processPushNotificationJob
  );
  notificationQueue().process(
    'send-booking-reminder',
    5,
    processBookingReminderJob
  );

  // Payment queue processors
  paymentQueue().process('process-payment', 2, processPaymentJob);

  // Report queue processors
  reportQueue().process('generate-report', 1, processReportJob);

  // Maintenance queue processors
  maintenanceQueue().process(
    'cleanup-expired-sessions',
    1,
    processMaintenanceJob
  );
  maintenanceQueue().process('sync-external-data', 1, processMaintenanceJob);
  maintenanceQueue().process('update-activity-stats', 1, processMaintenanceJob);

  // Set up global event handlers
  setupEventHandlers();

  logger.info('Job workers initialized successfully');
}

function setupEventHandlers() {
  const queues = [
    emailQueue(),
    notificationQueue(),
    paymentQueue(),
    reportQueue(),
    maintenanceQueue(),
  ];

  queues.forEach(queue => {
    queue.on('error', error => {
      logger.error('Queue error', {
        queue: queue.name,
        error: error.message,
        stack: error.stack,
      });
    });

    queue.on('waiting', jobId => {
      logger.debug('Job waiting', { queue: queue.name, jobId });
    });

    queue.on('active', job => {
      logger.info('Job started', {
        queue: queue.name,
        jobId: job.id,
        type: job.data.type,
        attempts: job.attemptsMade,
      });
    });

    queue.on('completed', job => {
      logger.info('Job completed', {
        queue: queue.name,
        jobId: job.id,
        type: job.data.type,
        duration: job.finishedOn
          ? job.finishedOn - job.processedOn!
          : undefined,
        attempts: job.attemptsMade,
      });
    });

    queue.on('failed', (job, error) => {
      logger.error('Job failed', {
        queue: queue.name,
        jobId: job.id,
        type: job.data.type,
        error: error.message,
        attempts: job.attemptsMade,
        maxAttempts: job.opts.attempts,
      });
    });

    queue.on('stalled', job => {
      logger.warn('Job stalled', {
        queue: queue.name,
        jobId: job.id,
        type: job.data.type,
      });
    });

    queue.on('progress', (job, progress) => {
      logger.debug('Job progress', {
        queue: queue.name,
        jobId: job.id,
        type: job.data.type,
        progress,
      });
    });
  });
}

// Graceful shutdown
export async function shutdownWorkers() {
  logger.info('Shutting down job workers...');

  const queues = [
    emailQueue(),
    notificationQueue(),
    paymentQueue(),
    reportQueue(),
    maintenanceQueue(),
  ];

  // Close all queues
  await Promise.all(queues.map(queue => queue.close()));

  logger.info('Job workers shut down successfully');
}

interface QueueHealth {
  status: 'healthy' | 'unhealthy';
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  isPaused: boolean;
  error?: string;
}

// Health check for workers
export async function checkWorkerHealth() {
  const queues = [
    emailQueue(),
    notificationQueue(),
    paymentQueue(),
    reportQueue(),
    maintenanceQueue(),
  ];
  const health: Record<string, QueueHealth> = {};

  for (const queue of queues) {
    try {
      const [waiting, active, completed, failed] = await Promise.all([
        queue.getWaiting(),
        queue.getActive(),
        queue.getCompleted(),
        queue.getFailed(),
      ]);

      health[queue.name] = {
        status: 'healthy',
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        isPaused: await queue.isPaused(),
      };
    } catch (error) {
      health[queue.name] = {
        status: 'unhealthy',
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        isPaused: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return health;
}

// Process termination handlers
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  await shutdownWorkers();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await shutdownWorkers();
  process.exit(0);
});

// Initialize workers if this file is run directly
if (require.main === module) {
  initializeWorkers();

  // Keep the process running
  process.on('uncaughtException', error => {
    logger.error('Uncaught exception', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled rejection', { reason, promise });
    process.exit(1);
  });

  logger.info('Job worker process started');
}
