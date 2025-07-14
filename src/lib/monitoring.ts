import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

// Error tracking and monitoring utilities
export class MonitoringService {
  private static instance: MonitoringService;

  private constructor() {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  // Error tracking
  captureError(
    error: Error,
    context?: Record<string, unknown>,
    user?: { id: string; email?: string }
  ) {
    // Log to our structured logger
    logger.error('Application error', {
      error: error.message,
      stack: error.stack,
      context,
      userId: user?.id,
      userEmail: user?.email,
    });

    // Send to Sentry with context
    Sentry.withScope(scope => {
      if (user) {
        scope.setUser({
          id: user.id,
          email: user.email,
        });
      }

      if (context) {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
        scope.setContext('additional', context);
      }

      Sentry.captureException(error);
    });
  }

  // Performance monitoring
  startTransaction(name: string, operation: string = 'navigation') {
    return Sentry.startTransaction({ name, op: operation });
  }

  // Custom metrics
  captureMetric(
    name: string,
    value: number,
    unit: string = 'none',
    tags?: Record<string, string>
  ) {
    // Log metric
    logger.info('Performance metric', {
      metric: name,
      value,
      unit,
      tags,
      type: 'metric',
    });

    // Send to Sentry (if available in your plan)
    Sentry.metrics.increment(name, value, {
      unit,
      tags,
    });
  }

  // Business event tracking
  captureEvent(
    name: string,
    data?: Record<string, unknown>,
    user?: { id: string; email?: string }
  ) {
    logger.info('Business event', {
      event: name,
      data,
      userId: user?.id,
      userEmail: user?.email,
      type: 'business-event',
    });

    Sentry.addBreadcrumb({
      message: name,
      category: 'business',
      data,
      level: 'info',
    });
  }

  // Performance timing
  timing(name: string, startTime: number, endTime: number = Date.now()) {
    const duration = endTime - startTime;

    this.captureMetric(`${name}.duration`, duration, 'millisecond');

    return duration;
  }

  // API response monitoring
  trackApiResponse(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    userId?: string
  ) {
    const tags = {
      method,
      endpoint,
      status_code: statusCode.toString(),
    };

    logger.info('API response', {
      method,
      endpoint,
      statusCode,
      duration,
      userId,
      type: 'api-response',
    });

    this.captureMetric('api.response_time', duration, 'millisecond', tags);
    this.captureMetric('api.requests', 1, 'count', tags);

    if (statusCode >= 400) {
      this.captureMetric('api.errors', 1, 'count', tags);
    }
  }

  // Database query monitoring
  trackDatabaseQuery(
    operation: string,
    table: string,
    duration: number,
    success: boolean = true
  ) {
    const tags = {
      operation,
      table,
      success: success.toString(),
    };

    logger.debug('Database query', {
      operation,
      table,
      duration,
      success,
      type: 'db-query',
    });

    this.captureMetric('db.query_time', duration, 'millisecond', tags);
    this.captureMetric('db.queries', 1, 'count', tags);

    if (!success) {
      this.captureMetric('db.errors', 1, 'count', tags);
    }
  }

  // Authentication monitoring
  trackAuthEvent(
    event: 'login' | 'logout' | 'register' | 'password_reset' | 'failed_login',
    userId?: string,
    metadata?: Record<string, unknown>
  ) {
    logger.info('Authentication event', {
      event,
      userId,
      metadata,
      type: 'auth-event',
    });

    this.captureMetric(`auth.${event}`, 1, 'count', {
      event,
    });

    this.captureEvent(`auth:${event}`, {
      userId,
      ...metadata,
    });
  }

  // Payment monitoring
  trackPaymentEvent(
    event: 'initiated' | 'completed' | 'failed' | 'refunded',
    amount: number,
    currency: string = 'EUR',
    provider: string,
    userId?: string,
    bookingId?: string
  ) {
    const tags = {
      event,
      currency,
      provider,
    };

    logger.info('Payment event', {
      event,
      amount,
      currency,
      provider,
      userId,
      bookingId,
      type: 'payment-event',
    });

    this.captureMetric(`payment.${event}`, 1, 'count', tags);
    this.captureMetric(`payment.${event}.amount`, amount, 'none', tags);

    this.captureEvent(`payment:${event}`, {
      amount,
      currency,
      provider,
      userId,
      bookingId,
    });
  }

  // Business metrics
  trackBookingEvent(
    event: 'created' | 'confirmed' | 'cancelled' | 'completed',
    bookingId: string,
    activityId: string,
    userId: string,
    amount?: number
  ) {
    logger.info('Booking event', {
      event,
      bookingId,
      activityId,
      userId,
      amount,
      type: 'booking-event',
    });

    this.captureMetric(`booking.${event}`, 1, 'count', { event });

    if (amount && event === 'created') {
      this.captureMetric('booking.value', amount, 'none');
    }

    this.captureEvent(`booking:${event}`, {
      bookingId,
      activityId,
      userId,
      amount,
    });
  }

  // User behavior tracking
  trackUserAction(
    action: string,
    userId: string,
    metadata?: Record<string, unknown>
  ) {
    logger.debug('User action', {
      action,
      userId,
      metadata,
      type: 'user-action',
    });

    this.captureMetric(`user.${action}`, 1, 'count', { action });

    Sentry.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      data: metadata,
      level: 'info',
    });
  }

  // Health check monitoring
  trackHealthCheck(
    service: string,
    status: 'healthy' | 'unhealthy',
    responseTime?: number
  ) {
    const tags = { service, status };

    logger.info('Health check', {
      service,
      status,
      responseTime,
      type: 'health-check',
    });

    this.captureMetric(
      `health.${service}`,
      status === 'healthy' ? 1 : 0,
      'none',
      tags
    );

    if (responseTime !== undefined) {
      this.captureMetric(
        `health.${service}.response_time`,
        responseTime,
        'millisecond',
        tags
      );
    }
  }

  // Set user context
  setUser(user: { id: string; email?: string; role?: string; name?: string }) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.name,
    });

    Sentry.setTag('user.role', user.role);
  }

  // Clear user context (on logout)
  clearUser() {
    Sentry.setUser(null);
  }

  // Add custom context
  setContext(key: string, context: Record<string, unknown>) {
    Sentry.setContext(key, context);
  }

  // Add breadcrumb
  addBreadcrumb(
    message: string,
    category: string = 'custom',
    data?: Record<string, unknown>
  ) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
      timestamp: Date.now() / 1000,
    });
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();

// Convenience functions
export const captureError = (
  error: Error,
  context?: Record<string, unknown>,
  user?: { id: string; email?: string }
) => monitoring.captureError(error, context, user);

export const trackApiResponse = (
  method: string,
  endpoint: string,
  statusCode: number,
  duration: number,
  userId?: string
) =>
  monitoring.trackApiResponse(method, endpoint, statusCode, duration, userId);

export const trackAuthEvent = (
  event: 'login' | 'logout' | 'register' | 'password_reset' | 'failed_login',
  userId?: string,
  metadata?: Record<string, unknown>
) => monitoring.trackAuthEvent(event, userId, metadata);

export const trackPaymentEvent = (
  event: 'initiated' | 'completed' | 'failed' | 'refunded',
  amount: number,
  currency: string,
  provider: string,
  userId?: string,
  bookingId?: string
) =>
  monitoring.trackPaymentEvent(
    event,
    amount,
    currency,
    provider,
    userId,
    bookingId
  );

export const trackBookingEvent = (
  event: 'created' | 'confirmed' | 'cancelled' | 'completed',
  bookingId: string,
  activityId: string,
  userId: string,
  amount?: number
) => monitoring.trackBookingEvent(event, bookingId, activityId, userId, amount);

export const trackUserAction = (
  action: string,
  userId: string,
  metadata?: Record<string, unknown>
) => monitoring.trackUserAction(action, userId, metadata);
