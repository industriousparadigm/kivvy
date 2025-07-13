import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  
  debug: process.env.NODE_ENV === 'development',
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  environment: process.env.NODE_ENV,
  
  beforeSend(event, hint) {
    // Filter out errors we don't want to track
    if (event.exception) {
      const error = hint.originalException;
      
      // Don't track certain types of errors in development
      if (process.env.NODE_ENV === 'development') {
        const errorMessage = error?.toString() || '';
        if (errorMessage.includes('ECONNREFUSED') || 
            errorMessage.includes('Redis connection')) {
          return null;
        }
      }
    }
    
    return event;
  },
  
  // Custom tags for better filtering
  initialScope: {
    tags: {
      component: 'client',
    },
  },
});