"use client";

import dynamic from 'next/dynamic';

// Disable SSR for Preloader to prevent hydration errors
const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false
});

export default function PreloaderWrapper() {
  return <Preloader />;
}