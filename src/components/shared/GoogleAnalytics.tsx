'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, unknown>) => void;
  }
}

export default function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
  useEffect(() => {
    // Track Core Web Vitals
    const reportWebVitals = (metric: { name: string; value: number; id: string }) => {
      // Send metrics to analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        });
      }
    };

    // Initialize performance monitoring
    const initWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getFCP(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
      } catch (error) {
        console.error('Failed to load web-vitals:', error);
      }
    };

    initWebVitals();
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            send_page_view: false,
          });
          
          // Send initial page view
          gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}
