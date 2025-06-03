
import { useEffect } from 'react';

export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`${componentName} took ${renderTime.toFixed(2)}ms to render`);
      }
    };
  }, [componentName]);
}

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

export function useWebVitals() {
  useEffect(() => {
    // Check if PerformanceObserver is supported
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    const metrics: WebVitalMetric[] = [];

    const trackMetric = (metric: WebVitalMetric) => {
      metrics.push(metric);
      
      // Send to analytics service (example)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter: metric.timestamp
        });
      }
      
      console.log(`Core Web Vital - ${metric.name}: ${metric.value} (${metric.rating})`);
    };

    const observers: PerformanceObserver[] = [];

    try {
      // Largest Contentful Paint (LCP)
      if (PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          const value = lastEntry.startTime;
          
          trackMetric({
            name: 'LCP',
            value,
            rating: value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          });
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        observers.push(lcpObserver);
      }

      // First Input Delay (FID) via Event Timing API
      if (PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEventTiming;
            const fidValue = fidEntry.processingStart - fidEntry.startTime;
            
            trackMetric({
              name: 'FID',
              value: fidValue,
              rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            });
          }
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
        observers.push(fidObserver);
      }

      // Cumulative Layout Shift (CLS)
      if (PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShiftEntry = entry as LayoutShift;
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
            }
          }
          
          trackMetric({
            name: 'CLS',
            value: clsValue,
            rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
            timestamp: Date.now()
          });
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        observers.push(clsObserver);
      }

      // Time to First Byte (TTFB)
      if (PerformanceObserver.supportedEntryTypes?.includes('navigation')) {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const navEntry = entry as PerformanceNavigationTiming;
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            
            trackMetric({
              name: 'TTFB',
              value: ttfb,
              rating: ttfb <= 800 ? 'good' : ttfb <= 1800 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            });
          }
        });
        
        navigationObserver.observe({ type: 'navigation', buffered: true });
        observers.push(navigationObserver);
      }

      return () => {
        observers.forEach(observer => observer.disconnect());
      };
    } catch (error) {
      console.warn('Error setting up performance observers:', error);
    }
  }, []);
}

// Type definitions for performance APIs
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
