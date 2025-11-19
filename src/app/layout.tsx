import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import PerformanceDashboard from "@/components/PerformanceDashboard";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
        {/* CRITICAL FIX: Add viewport meta for proper mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics GA_ID={process.env.NEXT_PUBLIC_GA_ID} />}
        {process.env.NODE_ENV === "development" && <PerformanceMonitor />}
        {process.env.NODE_ENV === "development" && <PerformanceDashboard />}
        <ErrorBoundary>
          <ClientBody>{children}</ClientBody>
        </ErrorBoundary>
      </body>
    </html>
  );
}
