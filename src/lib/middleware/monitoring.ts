import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';

export interface MonitoringContext {
  startTime: number;
  endpoint: string;
  method: string;
  userId?: string;
}

// Middleware to automatically track API requests
export function withMonitoring<
  T extends (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>,
>(handler: T, endpoint?: string): T {
  return (async (request: NextRequest, ...args: unknown[]) => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const pathname = new URL(url).pathname;
    const endpointName = endpoint || pathname;

    let userId: string | undefined;
    let response: NextResponse;
    let error: Error | null = null;

    try {
      // Get user session for tracking (skip for now to avoid issues)
      // TODO: Fix auth context issue
      // try {
      //   const session = await auth();
      //   userId = session?.user?.id;
      //
      //   if (userId) {
      //     monitoring.setUser({
      //       id: userId,
      //       email: session?.user?.email,
      //       role: session?.user?.role,
      //       name: session?.user?.name,
      //     });
      //   }
      // } catch (sessionError) {
      //   // Session error should not break the request
      //   console.warn('Failed to get session for monitoring:', sessionError);
      // }

      // Add request breadcrumb
      monitoring.addBreadcrumb(`API ${method} ${endpointName}`, 'api', {
        method,
        endpoint: endpointName,
        userId,
      });

      // Execute the handler
      response = await handler(request, ...args);

      return response;
    } catch (err) {
      error = err as Error;

      // Capture error with context
      monitoring.captureError(error, {
        endpoint: endpointName,
        method,
        url,
        userId,
      });

      // Re-throw to let Next.js handle it
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      const statusCode = response?.status || (error ? 500 : 200);

      // Track API response
      monitoring.trackApiResponse(
        method,
        endpointName,
        statusCode,
        duration,
        userId
      );

      // Log response details
      if (error) {
        console.error(`API ${method} ${endpointName} failed:`, {
          statusCode: 500,
          duration,
          error: error.message,
          userId,
        });
      } else {
        console.log(`API ${method} ${endpointName}:`, {
          statusCode,
          duration,
          userId,
        });
      }
    }
  }) as T;
}

// Database operation monitoring decorator
export function withDatabaseMonitoring<
  T extends (...args: unknown[]) => Promise<unknown>,
>(operation: string, table: string, fn: T): T {
  return (async (...args: unknown[]) => {
    const startTime = Date.now();
    let success = true;

    try {
      const result = await fn(...args);
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = Date.now() - startTime;
      monitoring.trackDatabaseQuery(operation, table, duration, success);
    }
  }) as T;
}

// Performance monitoring decorator
export function withPerformanceMonitoring<
  T extends (...args: unknown[]) => Promise<unknown>,
>(name: string, fn: T): T {
  return (async (...args: unknown[]) => {
    const startTime = Date.now();

    try {
      const result = await fn(...args);
      return result;
    } finally {
      monitoring.timing(name, startTime);
    }
  }) as T;
}

// Error boundary for React components (to be used in error.tsx files)
export function captureComponentError(
  error: Error,
  componentName: string,
  props?: Record<string, unknown>
) {
  monitoring.captureError(error, {
    component: componentName,
    props,
    type: 'component-error',
  });
}
