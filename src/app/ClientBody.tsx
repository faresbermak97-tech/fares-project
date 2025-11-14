"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/shared/Preloader";
import { monitorAnimationPerformance } from "@/utils/animation";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    document.body.className = "antialiased";
    // Start performance monitoring
    monitorAnimationPerformance();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPreloader && <Preloader />}
      <div className="antialiased">{children}</div>
    </>
  );
}
