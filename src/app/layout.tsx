import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: "Fares Bermak - Remote Virtual Assistant & Data Entry",
  description: "Professional remote virtual assistant and data entry services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics GA_ID={process.env.NEXT_PUBLIC_GA_ID} />}
        <ClientBody>{children}</ClientBody>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
