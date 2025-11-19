"use client";

import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // CRITICAL FIX: Manage scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
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
          setIsReady(true);
          window.scrollTo(0, 0);
        });
      });
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showPreloader && <Preloader />}
      <div 
        className="antialiased" 
        style={{ 
          visibility: isReady ? 'visible' : 'hidden',
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </>
  );
}
