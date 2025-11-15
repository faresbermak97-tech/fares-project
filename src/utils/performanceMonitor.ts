// Performance monitoring utilities
export interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  // Start monitoring component render performance
  startRenderMonitoring(componentName: string) {
    const startTime = performance.now();

    return {
      end: () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;

        this.metrics.push({
          renderTime,
          componentName,
          timestamp: Date.now()
        });

        // Log warning if render takes too long
        if (renderTime > 16) { // More than one frame at 60fps
          console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
        }

        return renderTime;
      }
    };
  }

  // Monitor memory usage
  startMemoryMonitoring(interval: number = 5000) {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const intervalId = setInterval(() => {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / 1048576; // Convert to MB

      // Log warning if memory usage is high
      if (usedMemory > 50) {
        console.warn(`High memory usage detected: ${usedMemory.toFixed(2)}MB`);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }

  // Get performance report
  getReport() {
    const componentMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.componentName]) {
        acc[metric.componentName] = {
          count: 0,
          totalTime: 0,
          averageTime: 0,
          maxTime: 0
        };
      }

      acc[metric.componentName].count++;
      acc[metric.componentName].totalTime += metric.renderTime;
      acc[metric.componentName].averageTime = acc[metric.componentName].totalTime / acc[metric.componentName].count;
      acc[metric.componentName].maxTime = Math.max(acc[metric.componentName].maxTime, metric.renderTime);

      return acc;
    }, {} as Record<string, { count: number; totalTime: number; averageTime: number; maxTime: number }>);

    return componentMetrics;
  }

  // Clear all metrics
  clearMetrics() {
    this.metrics = [];
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// HOC to wrap components with performance monitoring
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string = Component.displayName || Component.name || 'Unknown'
) {
  const WrappedComponent = (props: P) => {
    const monitor = performanceMonitor.startRenderMonitoring(componentName);

    useEffect(() => {
      const renderTime = monitor.end();

      return () => {
        // Cleanup if needed
      };
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;

  return WrappedComponent;
}
