
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
    const metrics: WebVitalMetric[] = [];

    // Core Web Vitals tracking
    const trackMetric = (metric: WebVitalMetric) => {
      metrics.push(metric);
      
      // Send to analytics service (example)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          custom_parameter: metric.timestamp
        });
      }
      
      console.log(`Core Web Vital - ${metric.name}: ${metric.value} (${metric.rating})`);
    };

    // Largest Contentful Paint (LCP)
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

    // First Input Delay (FID) via Event Timing API
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidValue = entry.processingStart - entry.startTime;
        
        trackMetric({
          name: 'FID',
          value: fidValue,
          rating: fidValue <= 100 ? 'good' : fidValue <= 300 ? 'needs-improvement' : 'poor',
          timestamp: Date.now()
        });
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
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

    // Time to First Byte (TTFB)
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

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      navigationObserver.disconnect();
    };
  }, []);
}
