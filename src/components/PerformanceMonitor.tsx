"use client";
import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Log page load performance
    window.addEventListener("load", () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      console.info("Page Load Performance", {
        pageLoadTime: `${pageLoadTime}ms`,
        domReady: `${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`,
        resources: performance.getEntriesByType("resource").length,
      });

      // Log slow page loads
      if (pageLoadTime > 3000) {
        console.warn("Slow page load detected", { pageLoadTime });
      }
    });

    // Monitor long tasks (tasks taking more than 50ms)
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn("Long task detected", {
                duration: `${entry.duration.toFixed(2)}ms`,
                startTime: entry.startTime,
              });
            }
          }
        });

        observer.observe({ entryTypes: ["longtask"] });
        return () => observer.disconnect();
      } catch (e) {
        // PerformanceObserver not fully supported
        console.warn("PerformanceObserver not fully supported:", e);
      }
    }
  }, []);

  return null;
}