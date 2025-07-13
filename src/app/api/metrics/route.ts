import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    const format = searchParams.get('format') || 'json';
    
    logger.info('Metrics request', {
      period,
      format,
      userId: session.user.id,
      type: 'metrics-request',
    });
    
    // Calculate time range based on period
    let startTime: Date;
    const now = new Date();
    
    switch (period) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    
    // Collect metrics from database
    const [
      totalUsers,
      totalProviders,
      totalActivities,
      totalBookings,
      recentBookings,
      recentUsers,
      recentPayments,
      activeActivities,
      topCategories,
      providerStats,
    ] = await Promise.all([
      // Total counts
      prisma.user.count(),
      prisma.provider.count(),
      prisma.activity.count({ where: { isActive: true } }),
      prisma.booking.count(),
      
      // Recent activity (within time period)
      prisma.booking.count({
        where: {
          createdAt: { gte: startTime },
        },
      }),
      
      prisma.user.count({
        where: {
          createdAt: { gte: startTime },
        },
      }),
      
      prisma.payment.findMany({
        where: {
          createdAt: { gte: startTime },
          status: 'SUCCEEDED',
        },
        select: {
          amount: true,
          currency: true,
          createdAt: true,
        },
      }),
      
      // Active activities with sessions
      prisma.activity.count({
        where: {
          isActive: true,
          sessions: {
            some: {
              startTime: { gte: now },
              status: 'SCHEDULED',
            },
          },
        },
      }),
      
      // Category breakdown
      prisma.activity.groupBy({
        by: ['category'],
        where: { isActive: true },
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
        take: 10,
      }),
      
      // Provider statistics
      prisma.provider.findMany({
        include: {
          _count: {
            select: {
              activities: true,
            },
          },
          activities: {
            include: {
              _count: {
                select: {
                  bookings: true,
                },
              },
            },
          },
        },
        take: 10,
        orderBy: {
          activities: {
            _count: 'desc',
          },
        },
      }),
    ]);
    
    // Calculate revenue metrics
    const totalRevenue = recentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const averageBookingValue = recentBookings > 0 ? totalRevenue / recentBookings : 0;
    
    // Calculate growth rates (simplified - comparing with previous period)
    const prevPeriodStart = new Date(startTime.getTime() - (now.getTime() - startTime.getTime()));
    
    const [prevBookings, prevUsers, prevRevenue] = await Promise.all([
      prisma.booking.count({
        where: {
          createdAt: { gte: prevPeriodStart, lt: startTime },
        },
      }),
      
      prisma.user.count({
        where: {
          createdAt: { gte: prevPeriodStart, lt: startTime },
        },
      }),
      
      prisma.payment.findMany({
        where: {
          createdAt: { gte: prevPeriodStart, lt: startTime },
          status: 'SUCCEEDED',
        },
        select: { amount: true },
      }),
    ]);
    
    const prevTotalRevenue = prevRevenue.reduce((sum, payment) => sum + payment.amount, 0);
    
    const metrics = {
      timestamp: now.toISOString(),
      period,
      
      // Overview metrics
      overview: {
        totalUsers,
        totalProviders,
        totalActivities,
        totalBookings,
        activeActivities,
      },
      
      // Recent activity
      recent: {
        newBookings: recentBookings,
        newUsers: recentUsers,
        revenue: totalRevenue,
        averageBookingValue,
      },
      
      // Growth metrics
      growth: {
        bookingsGrowth: prevBookings > 0 ? ((recentBookings - prevBookings) / prevBookings) * 100 : 0,
        usersGrowth: prevUsers > 0 ? ((recentUsers - prevUsers) / prevUsers) * 100 : 0,
        revenueGrowth: prevTotalRevenue > 0 ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100 : 0,
      },
      
      // Category breakdown
      categories: topCategories.map(cat => ({
        category: cat.category,
        count: cat._count.category,
      })),
      
      // Top providers
      topProviders: providerStats.map(provider => ({
        id: provider.id,
        businessName: provider.businessName,
        activitiesCount: provider._count.activities,
        totalBookings: provider.activities.reduce((sum, activity) => sum + activity._count.bookings, 0),
      })),
      
      // Time series data (simplified hourly buckets for recent period)
      timeSeries: await generateTimeSeries(startTime, now),
    };
    
    logger.info('Metrics generated', {
      period,
      metricsCount: Object.keys(metrics).length,
      totalRevenue,
      recentBookings,
      type: 'metrics-response',
    });
    
    // Return metrics in requested format
    if (format === 'prometheus') {
      return new NextResponse(formatPrometheusMetrics(metrics), {
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    
    return NextResponse.json(metrics);
    
  } catch (error) {
    logger.error('Metrics request failed', {
      error: error.message,
      type: 'metrics-error',
    });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate time series data for charts
async function generateTimeSeries(startTime: Date, endTime: Date) {
  const buckets: any[] = [];
  const bucketSize = 60 * 60 * 1000; // 1 hour buckets
  
  for (let time = startTime.getTime(); time < endTime.getTime(); time += bucketSize) {
    const bucketStart = new Date(time);
    const bucketEnd = new Date(time + bucketSize);
    
    const [bookings, payments] = await Promise.all([
      prisma.booking.count({
        where: {
          createdAt: { gte: bucketStart, lt: bucketEnd },
        },
      }),
      
      prisma.payment.findMany({
        where: {
          createdAt: { gte: bucketStart, lt: bucketEnd },
          status: 'SUCCEEDED',
        },
        select: { amount: true },
      }),
    ]);
    
    const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    buckets.push({
      timestamp: bucketStart.toISOString(),
      bookings,
      revenue,
    });
  }
  
  return buckets;
}

// Format metrics for Prometheus scraping
function formatPrometheusMetrics(metrics: any): string {
  const lines: string[] = [];
  
  // Helper function to add metric
  const addMetric = (name: string, value: number, labels: Record<string, string> = {}) => {
    const labelStr = Object.entries(labels)
      .map(([key, val]) => `${key}="${val}"`)
      .join(',');
    lines.push(`kidshiz_${name}{${labelStr}} ${value}`);
  };
  
  // Overview metrics
  addMetric('total_users', metrics.overview.totalUsers);
  addMetric('total_providers', metrics.overview.totalProviders);
  addMetric('total_activities', metrics.overview.totalActivities);
  addMetric('total_bookings', metrics.overview.totalBookings);
  addMetric('active_activities', metrics.overview.activeActivities);
  
  // Recent metrics
  addMetric('new_bookings', metrics.recent.newBookings, { period: metrics.period });
  addMetric('new_users', metrics.recent.newUsers, { period: metrics.period });
  addMetric('revenue_total', metrics.recent.revenue, { period: metrics.period });
  addMetric('average_booking_value', metrics.recent.averageBookingValue, { period: metrics.period });
  
  // Growth metrics
  addMetric('bookings_growth_percent', metrics.growth.bookingsGrowth);
  addMetric('users_growth_percent', metrics.growth.usersGrowth);
  addMetric('revenue_growth_percent', metrics.growth.revenueGrowth);
  
  // Category metrics
  metrics.categories.forEach((cat: any) => {
    addMetric('activities_by_category', cat.count, { category: cat.category });
  });
  
  return lines.join('\n');
}