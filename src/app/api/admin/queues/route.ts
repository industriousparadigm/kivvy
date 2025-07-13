import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { checkQueueHealth, queueManager } from '@/lib/queue';
import { checkWorkerHealth } from '@/lib/jobs/worker';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const [queueHealth, workerHealth, queueStats] = await Promise.all([
      checkQueueHealth(),
      checkWorkerHealth(),
      queueManager.getAllStats(),
    ]);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      queues: queueHealth,
      workers: workerHealth,
      stats: queueStats,
    });
  } catch (error) {
    console.error('Queue health check failed:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { action, queueName } = await request.json();
    
    switch (action) {
      case 'pause':
        await queueManager.pauseQueue(queueName);
        return NextResponse.json({ success: true, message: `Queue ${queueName} paused` });
      
      case 'resume':
        await queueManager.resumeQueue(queueName);
        return NextResponse.json({ success: true, message: `Queue ${queueName} resumed` });
      
      case 'clean':
        await queueManager.cleanQueue(queueName);
        return NextResponse.json({ success: true, message: `Queue ${queueName} cleaned` });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Queue action failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}