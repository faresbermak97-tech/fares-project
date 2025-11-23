"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Create a client component wrapper for the Preloader
const PreloaderWrapper = dynamic(() => import("@/components/PreloaderWrapper"), {
  loading: () => <div className="fixed inset-0 z-[9999] bg-black" />,
});

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // CRITICAL FIX: Manage scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Set body class
    document.body.className = "antialiased";

    // CRITICAL FIX: Ensure we start at top
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setShowPreloader(false);

      // CRITICAL FIX: Wait for render before allowing interactions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      });
    }, 3800); // Match preloader timing (2500ms + 100ms + 1200ms)

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPreloader && <PreloaderWrapper />}
      <div
        className="antialiased"
        style={{
          opacity: showPreloader ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </>
  );
}
