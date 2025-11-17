'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { initWebVitals, trackPageView } from '@/lib/analytics';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Return null if GA_ID is empty
  if (!GA_ID) {
    return null;
  }

  useEffect(() => {
    // Initialize gtag if it doesn't exist
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      
      // Create gtag function if it doesn't exist
      if (!window.gtag) {
        window.gtag = function(...args: any[]) {
          window.dataLayer.push(args);
        };
      }
      
      // Initialize gtag with current date
      window.gtag('js', new Date());
      
      // Configure with GA_ID
      window.gtag('config', GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false
      });
    }
    
    // Initialize Web Vitals tracking
    initWebVitals();
  }, [GA_ID]);

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

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
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
