"use client";
import React, { useState, useEffect } from "react";
import { getPageLoadMetrics } from "@/hooks/usePerformanceMonitor";

interface MetricData {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  threshold: {
    good: number;
    poor: number;
  };
}

/**
* Performance Dashboard Component
*
* This component displays Web Vitals metrics in a dashboard format.
* It's primarily intended for development use to monitor performance.
*/
export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return;

    // Set up keyboard shortcut to toggle dashboard (Ctrl+Shift+P)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Get real page load metrics when dashboard is visible
  useEffect(() => {
    if (!isVisible) return;

    // Get actual page load metrics
    const pageMetrics = getPageLoadMetrics();
    
    // Combine real metrics with mock data for demonstration
    setMetrics([
      {
        name: "LCP (Largest Contentful Paint)",
        value: 2.1,
        rating: "good",
        threshold: { good: 2.5, poor: 4.0 },
      },
      {
        name: "FID (First Input Delay)",
        value: 75,
        rating: "good",
        threshold: { good: 100, poor: 300 },
      },
      {
        name: "CLS (Cumulative Layout Shift)",
        value: 0.08,
        rating: "needs-improvement",
        threshold: { good: 0.1, poor: 0.25 },
      },
      {
        name: "FCP (First Contentful Paint)",
        value: 1.5,
        rating: "good",
        threshold: { good: 1.8, poor: 3.0 },
      },
      {
        name: "TTFB (Time to First Byte)",
        value: 600,
        rating: "needs-improvement",
        threshold: { good: 800, poor: 1800 },
      },
      // Add real page load metrics if available
      ...(pageMetrics ? [
        {
          name: "Page Load Time",
          value: Math.round(pageMetrics.loadTime! / 1000 * 10) / 10, // Convert to seconds with 1 decimal
          rating: pageMetrics.loadTime! < 3000 ? "good" : pageMetrics.loadTime! < 5000 ? "needs-improvement" : "poor" as "good" | "needs-improvement" | "poor",
          threshold: { good: 3, poor: 5 },
        },
        {
          name: "DOM Content Loaded",
          value: Math.round(pageMetrics.domContentLoaded! / 1000 * 10) / 10, // Convert to seconds with 1 decimal
          rating: pageMetrics.domContentLoaded! < 1500 ? "good" : pageMetrics.domContentLoaded! < 2500 ? "needs-improvement" : "poor" as "good" | "needs-improvement" | "poor",
          threshold: { good: 1.5, poor: 2.5 },
        },
      ] : []),
    ]);
  }, [isVisible]);

  if (process.env.NODE_ENV !== "development" || !isVisible) {
    return null;
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600";
      case "needs-improvement":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="border-b border-gray-100 pb-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">{metric.name}</div>
              <div className={`text-sm font-semibold ${getRatingColor(metric.rating)}`}>
                {metric.value}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Good: {metric.threshold.good}</span>
              <span>Poor: {metric.threshold.poor}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Press Ctrl+Shift+P to toggle this dashboard
      </div>
    </div>
  );
}