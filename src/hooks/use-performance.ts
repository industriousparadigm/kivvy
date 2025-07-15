'use client';

import { useEffect, useRef, useCallback } from 'react';
import { monitoring } from '@/lib/monitoring';

// Hook to track page performance
export function usePagePerformance(pageName: string) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const startTime = startTimeRef.current;

    // Track initial page load
    monitoring.captureMetric(
      `page.${pageName}.load_time`,
      Date.now() - startTime,
      'millisecond'
    );

    // Track core web vitals if available
    if (typeof window !== 'undefined' && 'performance' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            monitoring.captureMetric(
              `page.${pageName}.fcp`,
              entry.startTime,
              'millisecond'
            );
          }
        });
      });

      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch {
        // Browser doesn't support this
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        monitoring.captureMetric(
          `page.${pageName}.lcp`,
          lastEntry.startTime,
          'millisecond'
        );
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch {
        // Browser doesn't support this
      }

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value || 0;
          }
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch {
        // Browser doesn't support this
      }

      // Report CLS on page unload
      const reportCLS = () => {
        monitoring.captureMetric(`page.${pageName}.cls`, clsValue, 'none');
      };

      window.addEventListener('beforeunload', reportCLS);

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        window.removeEventListener('beforeunload', reportCLS);
      };
    }
  }, [pageName]);
}

// Hook to track component render performance
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderCountRef.current += 1;

    if (renderStartRef.current) {
      const renderTime = Date.now() - renderStartRef.current;
      monitoring.captureMetric(
        `component.${componentName}.render_time`,
        renderTime,
        'millisecond'
      );
    }
  });

  const startRender = useCallback(() => {
    renderStartRef.current = Date.now();
  }, []);

  return { startRender, renderCount: renderCountRef.current };
}

// Hook to track API call performance
export function useApiPerformance() {
  const trackApiCall = useCallback(
    async <T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> => {
      const startTime = Date.now();

      try {
        const result = await apiCall();
        const duration = Date.now() - startTime;

        monitoring.captureMetric(`api.${endpoint}.success`, 1, 'count');
        monitoring.captureMetric(
          `api.${endpoint}.duration`,
          duration,
          'millisecond'
        );

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        monitoring.captureMetric(`api.${endpoint}.error`, 1, 'count');
        monitoring.captureMetric(
          `api.${endpoint}.duration`,
          duration,
          'millisecond'
        );

        throw error;
      }
    },
    []
  );

  return { trackApiCall };
}

// Hook to track user interactions
export function useInteractionTracking() {
  const trackClick = useCallback(
    (element: string, metadata?: Record<string, unknown>) => {
      monitoring.trackUserAction('click', 'anonymous', {
        element,
        ...metadata,
      });
    },
    []
  );

  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    monitoring.trackUserAction('form_submit', 'anonymous', {
      formName,
      success,
    });
  }, []);

  const trackNavigation = useCallback((from: string, to: string) => {
    monitoring.trackUserAction('navigation', 'anonymous', { from, to });
  }, []);

  return { trackClick, trackFormSubmit, trackNavigation };
}

// Hook to monitor memory usage
export function useMemoryMonitoring() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'performance' in window &&
      'memory' in (window.performance as unknown as { memory: unknown })
    ) {
      const checkMemory = () => {
        const memory = (
          window.performance as unknown as {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;

        monitoring.captureMetric(
          'browser.memory.used',
          memory.usedJSHeapSize,
          'bytes'
        );
        monitoring.captureMetric(
          'browser.memory.total',
          memory.totalJSHeapSize,
          'bytes'
        );
        monitoring.captureMetric(
          'browser.memory.limit',
          memory.jsHeapSizeLimit,
          'bytes'
        );
      };

      // Check memory every 30 seconds
      const interval = setInterval(checkMemory, 30000);

      // Initial check
      checkMemory();

      return () => clearInterval(interval);
    }
  }, []);
}
