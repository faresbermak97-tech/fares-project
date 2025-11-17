"use client";
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

/**
* Example component demonstrating the usePerformanceMonitor hook
*/
export default function ExamplePerformanceComponent() {
  // Monitor the performance of this component
  usePerformanceMonitor("ExamplePerformanceComponent");

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-lg font-semibold mb-2">Performance Monitor Example</h2>
      <p className="text-gray-600">
        This component is being monitored for render performance.
        Check the console in development mode to see render times.
      </p>
    </div>
  );
}