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

export default function CurtainPreloader() {
  const [index, setIndex] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // CRITICAL FIX: Prevent all scrolling during preload
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    let currentIndex = 0;

    // Greeting rotation: 10 greetings × 250ms = 2500ms
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < greetings.length) {
        setIndex(currentIndex);
      } else {
        clearInterval(interval);

        // CRITICAL FIX: Start curtain animation at 2500ms
        setTimeout(() => {
          setIsAnimatingOut(true);

          // CRITICAL FIX: Wait 1200ms for curtain animation to complete
          setTimeout(() => {
            setShowPreloader(false);

            // CRITICAL FIX: Restore scroll after preloader fully exits
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0);
          }, 1200); // Match curtain animation duration
        }, 100); // Small delay before curtain starts
      }
    }, 250); // Faster greeting rotation (was 400ms)

    return () => {
      clearInterval(interval);
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!showPreloader) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Main Curtain with Curved Bottom */}
      <div
        className={`absolute inset-0 bg-black transition-transform ${
          isAnimatingOut ? 'animate-curtain-up' : ''
        }`}
        style={{
          transitionDuration: '1200ms',
          transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)',
          clipPath: isAnimatingOut
            ? 'ellipse(200% 100% at 50% 0%)'
            : 'none'
        }}
      >
        {/* Greeting Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-white text-4xl md:text-6xl font-bold transition-opacity duration-300 ${
              isAnimatingOut ? 'opacity-0' : 'opacity-100'
            }`}
            suppressHydrationWarning={true}
          >
            {isMounted ? greetings[index] : greetings[0]}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes curtain-up {
          0% {
            transform: translateY(0%);
            clip-path: ellipse(200% 100% at 50% 0%);
          }
          100% {
            transform: translateY(-100%);
            clip-path: ellipse(200% 100% at 50% 100%);
          }
        }

        .animate-curtain-up {
          animation: curtain-up 1200ms cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
      `}</style>
    </div>
  );
}