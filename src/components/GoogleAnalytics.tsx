'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { initWebVitals, trackPageView } from '@/lib/analytics';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GoogleAnalytics({ GA_ID }: { GA_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    // Initialize Web Vitals tracking
    initWebVitals();
    // Track page views on route change
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams, GA_ID]);

  // Return null if GA_ID is empty
  if (!GA_ID) {
    return null;
  }

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
