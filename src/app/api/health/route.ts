import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkQueueHealth } from '@/lib/queue';
import { logger } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const healthChecks: Record<string, any> = {};
  let overallStatus = 'healthy';

  try {
    // Database health check
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbDuration = Date.now() - dbStart;

      healthChecks.database = {
        status: 'healthy',
        responseTime: dbDuration,
        timestamp: new Date().toISOString(),
      };

      logger.debug('Database health check passed', {
        responseTime: dbDuration,
        type: 'health-check',
      });
    } catch (error) {
      healthChecks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      overallStatus = 'unhealthy';

      logger.error('Database health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'health-check',
      });
    }

    // Queue health check
    try {
      const queueStart = Date.now();
      const queueHealth = await checkQueueHealth();
      const queueDuration = Date.now() - queueStart;

      const isQueueHealthy =
        queueHealth.redis &&
        Object.values(queueHealth.queues).every(status => status === true);

      healthChecks.queues = {
        status: isQueueHealthy ? 'healthy' : 'degraded',
        responseTime: queueDuration,
        details: queueHealth,
        timestamp: new Date().toISOString(),
      };

      if (!isQueueHealthy && overallStatus === 'healthy') {
        overallStatus = 'degraded';
      }

      logger.debug('Queue health check completed', {
        status: isQueueHealthy ? 'healthy' : 'degraded',
        responseTime: queueDuration,
        redis: queueHealth.redis,
        type: 'health-check',
      });
    } catch (error) {
      healthChecks.queues = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      overallStatus = 'unhealthy';

      logger.error('Queue health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        type: 'health-check',
      });
    }

    // File system health check
    try {
      const fs = await import('fs/promises');
      const fsStart = Date.now();
      await fs.access(process.cwd());
      const fsDuration = Date.now() - fsStart;

      healthChecks.filesystem = {
        status: 'healthy',
        responseTime: fsDuration,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      healthChecks.filesystem = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
      overallStatus = 'unhealthy';
    }

    // Memory usage check
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    };

    // Consider memory unhealthy if heap usage is > 90% of total
    const memoryHealthy = memUsageMB.heapUsed < memUsageMB.heapTotal * 0.9;

    healthChecks.memory = {
      status: memoryHealthy ? 'healthy' : 'degraded',
      usage: memUsageMB,
      timestamp: new Date().toISOString(),
    };

    if (!memoryHealthy && overallStatus === 'healthy') {
      overallStatus = 'degraded';
    }

    // Environment checks
    const requiredEnvVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];

    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar]
    );

    healthChecks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      missingVariables: missingEnvVars,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    if (missingEnvVars.length > 0) {
      overallStatus = 'unhealthy';
    }

    const totalResponseTime = Date.now() - startTime;

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      responseTime: totalResponseTime,
      checks: healthChecks,
    };

    logger.info('Health check completed', {
      status: overallStatus,
      responseTime: totalResponseTime,
      checks: Object.keys(healthChecks),
      type: 'health-check',
    });

    // Return appropriate HTTP status
    const httpStatus =
      overallStatus === 'healthy'
        ? 200
        : overallStatus === 'degraded'
          ? 200
          : 503;

    return NextResponse.json(response, { status: httpStatus });
  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: 'health-check',
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      },
      { status: 503 }
    );
  }
}

// Lightweight readiness check (for Kubernetes/Docker)
export async function HEAD() {
  try {
    // Quick database ping
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}
