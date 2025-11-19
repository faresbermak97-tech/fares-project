'use client';

import { useEffect, useState } from 'react';

export const greetings = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Hola',
  'مرحبا',
  'Привет',
  'こんにちは',
  'Guten Tag',
  'Olá',
  'Namaste',
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // CRITICAL FIX: Prevent scroll during preload
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // CRITICAL FIX: Ensure we're at top
    window.scrollTo(0, 0);
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < greetings.length) {
        setIndex(currentIndex);
      } else {
        clearInterval(interval);
        
        // CRITICAL FIX: Delay hiding to ensure page is ready
        setTimeout(() => {
          setShowPreloader(false);
          // Restore scroll after a frame
          requestAnimationFrame(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0); // Ensure top position
          });
        }, 200);
      }
    }, 400);
    
    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!showPreloader) return null;

  if (!isClient) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
        <div className="text-white text-4xl md:text-6xl font-bold">
          {greetings[0]}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-white text-4xl md:text-6xl font-bold">
        {greetings[index]}
      </div>
    </div>
  );
}
