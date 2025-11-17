import { useEffect } from 'react';

interface PerformanceMetrics {
  loadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
}

export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }

      // Track in analytics if render time is slow
      if (renderTime > 1000) {
        console.warn(`[Performance] Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}

export function getPageLoadMetrics(): PerformanceMetrics | null {
  if (typeof window === 'undefined' || !window.performance) return null;

  const perfData = window.performance.timing;
  const navigationStart = perfData.navigationStart;

  return {
    loadTime: perfData.loadEventEnd - navigationStart,
    domContentLoaded: perfData.domContentLoadedEventEnd - navigationStart,
    firstPaint: perfData.responseStart - navigationStart,
    firstContentfulPaint: perfData.domContentLoadedEventStart - navigationStart,
  };
}