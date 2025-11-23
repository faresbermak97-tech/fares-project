import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ClientBody from "./ClientBody";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fares Bermak - Remote Virtual Assistant & Data Entry",
  description: "Professional remote virtual assistant and data entry services",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
      </head>
      <body suppressHydrationWarning className="antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics GA_ID={process.env.NEXT_PUBLIC_GA_ID} />}

        <ErrorBoundary>
          <ClientBody>{children}</ClientBody>
        </ErrorBoundary>
      </body>
    </html>
  );
}
