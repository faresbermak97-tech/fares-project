import type { Metric } from "web-vitals";

// Analytics module with dynamic imports for web-vitals
type AnalyticsEvent = {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: "good" | "needs-improvement" | "poor";
};

/**
 * Sends analytics data to Google Analytics
 */
function sendToGoogleAnalytics(metric: Metric): void {
  if (typeof window === "undefined" || !window.gtag) return;
  const event: AnalyticsEvent = {
    name: metric.name,
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    id: metric.id,
    delta: Math.round(metric.delta),
    rating: metric.rating,
  };
  window.gtag("event", metric.name, {
    event_category: "Web Vitals",
    event_label: event.id,
    value: event.value,
    metric_rating: event.rating,
    non_interaction: true,
  });
}

/**
 * Sends analytics data to console in development
 */
function logToConsole(metric: Metric): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    });
  }
}

/**
 * Reports Web Vitals metrics
 */
export function reportWebVitals(metric: Metric): void {
  logToConsole(metric);
  sendToGoogleAnalytics(metric);
}

/**
 * Initializes Web Vitals tracking
 */
export function initWebVitals(): void {
  if (typeof window === "undefined") return;

  // Dynamic import to avoid errors if web-vitals is not installed
  import("web-vitals")
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    })
    .catch(() => {
      console.warn("Web Vitals tracking disabled: web-vitals package not installed");
    });
}

/**
 * Custom event tracking
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}

/**
 * Page view tracking
 */
export function trackPageView(url: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", process.env.NEXT_PUBLIC_GA_ID!, {
    page_path: url,
  });
}
