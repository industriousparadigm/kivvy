import winston from 'winston';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(colors);

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };
    
    // Add request context if available
    if (meta.req) {
      logEntry.request = {
        method: meta.req.method,
        url: meta.req.url,
        userAgent: meta.req.headers?.['user-agent'],
        ip: meta.req.ip,
      };
      delete logEntry.req;
    }
    
    return JSON.stringify(logEntry);
  })
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.colorize(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    
    let output = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      output += '\n' + JSON.stringify(meta, null, 2);
    }
    
    return output;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  levels,
  level: process.env.LOG_LEVEL || 'info',
  format: structuredFormat,
  defaultMeta: {
    service: 'kivvy',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? structuredFormat : consoleFormat,
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: structuredFormat,
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'app.log'),
      format: structuredFormat,
    }),
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'exceptions.log'),
      format: structuredFormat,
    }),
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'rejections.log'),
      format: structuredFormat,
    }),
  ],
});

// Add request logging middleware helper
export const requestLogger = (req: NextRequest, res: NextResponse, next: () => void) => {
  const start = Date.now();
  
  // Log request start
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    sessionId: req.session?.id,
    userId: req.user?.id,
  });
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
      sessionId: req.session?.id,
      userId: req.user?.id,
    });
  });
  
  next();
};

// Performance monitoring helper
export const performanceLogger = {
  start: (operation: string, metadata?: Record<string, unknown>) => {
    const startTime = Date.now();
    
    return {
      end: (result?: unknown) => {
        const duration = Date.now() - startTime;
        
        logger.info('Performance metric', {
          operation,
          duration,
          metadata,
          result: result ? 'success' : 'failure',
        });
      },
      
      error: (error: Error) => {
        const duration = Date.now() - startTime;
        
        logger.error('Performance metric - error', {
          operation,
          duration,
          metadata,
          error: error.message,
          stack: error.stack,
        });
      },
    };
  },
};

// Security event logger
export const securityLogger = {
  loginAttempt: (email: string, success: boolean, ip: string, userAgent: string) => {
    logger.info('Login attempt', {
      email,
      success,
      ip,
      userAgent,
      type: 'authentication',
    });
  },
  
  loginSuccess: (userId: string, email: string, ip: string, userAgent: string) => {
    logger.info('Login successful', {
      userId,
      email,
      ip,
      userAgent,
      type: 'authentication',
    });
  },
  
  loginFailed: (email: string, reason: string, ip: string, userAgent: string) => {
    logger.warn('Login failed', {
      email,
      reason,
      ip,
      userAgent,
      type: 'authentication',
    });
  },
  
  suspiciousActivity: (userId: string, activity: string, details: Record<string, unknown>) => {
    logger.warn('Suspicious activity detected', {
      userId,
      activity,
      details,
      type: 'security',
    });
  },
  
  paymentAttempt: (userId: string, amount: number, success: boolean, provider: string) => {
    logger.info('Payment attempt', {
      userId,
      amount,
      success,
      provider,
      type: 'payment',
    });
  },
  
  dataAccess: (userId: string, resource: string, action: string) => {
    logger.info('Data access', {
      userId,
      resource,
      action,
      type: 'data-access',
    });
  },
};

// Business metrics logger
export const businessLogger = {
  bookingCreated: (bookingId: string, userId: string, activityId: string, amount: number) => {
    logger.info('Booking created', {
      bookingId,
      userId,
      activityId,
      amount,
      type: 'business-event',
    });
  },
  
  bookingCancelled: (bookingId: string, userId: string, reason: string) => {
    logger.info('Booking cancelled', {
      bookingId,
      userId,
      reason,
      type: 'business-event',
    });
  },
  
  activityCreated: (activityId: string, providerId: string, category: string) => {
    logger.info('Activity created', {
      activityId,
      providerId,
      category,
      type: 'business-event',
    });
  },
  
  userRegistered: (userId: string, role: string, provider: string) => {
    logger.info('User registered', {
      userId,
      role,
      provider,
      type: 'business-event',
    });
  },
  
  paymentProcessed: (paymentId: string, amount: number, provider: string, success: boolean) => {
    logger.info('Payment processed', {
      paymentId,
      amount,
      provider,
      success,
      type: 'business-event',
    });
  },
};

// Export default logger
export default logger;