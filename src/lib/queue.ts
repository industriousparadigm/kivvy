import Queue from 'bull';
import Redis from 'ioredis';

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

// Create Redis connection
let redis: Redis | null = null;
try {
  redis = new Redis(redisConfig);
  redis.on('error', (err) => {
    console.warn('Redis connection error:', err);
    redis = null;
  });
} catch (error) {
  console.warn('Failed to connect to Redis:', error);
  redis = null;
}

// Job types
export type JobType = 
  | 'send-email'
  | 'send-sms'
  | 'send-push-notification'
  | 'process-payment'
  | 'generate-report'
  | 'sync-external-data'
  | 'cleanup-expired-sessions'
  | 'send-booking-reminder'
  | 'update-activity-stats'
  | 'process-image-upload';

export interface JobData {
  type: JobType;
  payload: any;
  userId?: string;
  bookingId?: string;
  activityId?: string;
  metadata?: Record<string, any>;
}

// Create queues
const createQueue = (name: string): Queue.Queue => {
  if (redis) {
    return new Queue(name, {
      redis: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
  }
  
  // Fallback to in-memory queue (for development)
  return new Queue(name, {
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 50,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  });
};

// Define queues
export const emailQueue = createQueue('email');
export const notificationQueue = createQueue('notification');
export const paymentQueue = createQueue('payment');
export const reportQueue = createQueue('report');
export const maintenanceQueue = createQueue('maintenance');

// Queue management
export class QueueManager {
  private static instance: QueueManager;
  private queues: Map<string, Queue.Queue> = new Map();
  
  private constructor() {
    this.queues.set('email', emailQueue);
    this.queues.set('notification', notificationQueue);
    this.queues.set('payment', paymentQueue);
    this.queues.set('report', reportQueue);
    this.queues.set('maintenance', maintenanceQueue);
  }
  
  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }
  
  async addJob(
    queueName: string,
    jobData: JobData,
    options?: Queue.JobOptions
  ): Promise<Queue.Job> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    return queue.add(jobData.type, jobData, options);
  }
  
  async getQueueStats(queueName: string) {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);
    
    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }
  
  async getAllStats() {
    const stats: Record<string, any> = {};
    
    for (const [queueName, queue] of this.queues) {
      stats[queueName] = await this.getQueueStats(queueName);
    }
    
    return stats;
  }
  
  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    await queue.pause();
  }
  
  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    await queue.resume();
  }
  
  async cleanQueue(queueName: string, grace: number = 0): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue '${queueName}' not found`);
    }
    
    await queue.clean(grace, 'completed');
    await queue.clean(grace, 'failed');
  }
  
  async closeAll(): Promise<void> {
    const closePromises = Array.from(this.queues.values()).map(queue => queue.close());
    await Promise.all(closePromises);
  }
}

// Helper functions
export const queueManager = QueueManager.getInstance();

export async function addEmailJob(
  data: {
    to: string;
    subject: string;
    template: string;
    context?: Record<string, any>;
  },
  options?: Queue.JobOptions
): Promise<Queue.Job> {
  return queueManager.addJob('email', {
    type: 'send-email',
    payload: data,
  }, options);
}

export async function addNotificationJob(
  data: {
    userId: string;
    type: 'push' | 'sms' | 'email';
    title: string;
    message: string;
    data?: Record<string, any>;
  },
  options?: Queue.JobOptions
): Promise<Queue.Job> {
  return queueManager.addJob('notification', {
    type: data.type === 'push' ? 'send-push-notification' : 'send-sms',
    payload: data,
    userId: data.userId,
  }, options);
}

export async function addPaymentJob(
  data: {
    bookingId: string;
    action: 'process' | 'refund' | 'capture';
    amount?: number;
    reason?: string;
  },
  options?: Queue.JobOptions
): Promise<Queue.Job> {
  return queueManager.addJob('payment', {
    type: 'process-payment',
    payload: data,
    bookingId: data.bookingId,
  }, options);
}

export async function addReportJob(
  data: {
    type: 'activity-stats' | 'revenue-report' | 'user-engagement';
    providerId?: string;
    period: 'daily' | 'weekly' | 'monthly';
    date?: string;
  },
  options?: Queue.JobOptions
): Promise<Queue.Job> {
  return queueManager.addJob('report', {
    type: 'generate-report',
    payload: data,
  }, options);
}

export async function addMaintenanceJob(
  data: {
    task: 'cleanup-sessions' | 'sync-data' | 'update-stats';
    parameters?: Record<string, any>;
  },
  options?: Queue.JobOptions
): Promise<Queue.Job> {
  return queueManager.addJob('maintenance', {
    type: data.task === 'cleanup-sessions' ? 'cleanup-expired-sessions' : 'sync-external-data',
    payload: data,
  }, options);
}

// Scheduled jobs
export async function scheduleBookingReminders(): Promise<void> {
  // Schedule reminder jobs for upcoming bookings
  const reminderTime = new Date();
  reminderTime.setHours(reminderTime.getHours() + 24); // 24 hours before
  
  await queueManager.addJob('notification', {
    type: 'send-booking-reminder',
    payload: {
      reminderTime: reminderTime.toISOString(),
    },
  }, {
    delay: reminderTime.getTime() - Date.now(),
  });
}

export async function scheduleStatUpdates(): Promise<void> {
  // Schedule daily stats updates
  await queueManager.addJob('maintenance', {
    type: 'update-activity-stats',
    payload: {
      date: new Date().toISOString(),
    },
  }, {
    repeat: { cron: '0 2 * * *' }, // Daily at 2 AM
  });
}

export async function scheduleCleanupJobs(): Promise<void> {
  // Schedule cleanup jobs
  await queueManager.addJob('maintenance', {
    type: 'cleanup-expired-sessions',
    payload: {
      olderThan: '7d',
    },
  }, {
    repeat: { cron: '0 3 * * 0' }, // Weekly on Sunday at 3 AM
  });
}

// Health check
export async function checkQueueHealth(): Promise<{
  redis: boolean;
  queues: Record<string, boolean>;
  stats: Record<string, any>;
}> {
  const health = {
    redis: !!redis,
    queues: {} as Record<string, boolean>,
    stats: {} as Record<string, any>,
  };
  
  try {
    for (const [queueName, queue] of queueManager['queues']) {
      try {
        await queue.getWaiting();
        health.queues[queueName] = true;
      } catch (error) {
        health.queues[queueName] = false;
      }
    }
    
    health.stats = await queueManager.getAllStats();
  } catch (error) {
    console.error('Queue health check failed:', error);
  }
  
  return health;
}