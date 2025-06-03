
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../components/analytics/AnalyticsProvider';

export function usePageAnalytics() {
  const location = useLocation();
  const { trackPageView, trackEvent } = useAnalytics();

  useEffect(() => {
    // Track page view
    trackPageView(location.pathname);

    // Track page load time
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
      
      trackEvent('page_load_time', {
        page_path: location.pathname,
        load_time: Math.round(loadTime),
        connection_type: (navigator as any).connection?.effectiveType || 'unknown'
      });
    }

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;
      const scrollPercent = Math.round((scrollTop + windowHeight) / docHeight * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          trackEvent('scroll_depth', {
            page_path: location.pathname,
            scroll_depth: scrollPercent
          });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
      
      // Track time on page when leaving
      if (maxScrollDepth > 0) {
        trackEvent('page_engagement', {
          page_path: location.pathname,
          max_scroll_depth: maxScrollDepth
        });
      }
    };
  }, [location.pathname, trackPageView, trackEvent]);
}
