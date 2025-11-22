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

  useEffect(() => {
    // Prevent scroll during preload
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < greetings.length) {
        setIndex(currentIndex);
      } else {
        clearInterval(interval);
        
        // Start curtain animation
        setTimeout(() => {
          setIsAnimatingOut(true);
          
          // Remove preloader after animation completes
          setTimeout(() => {
            setShowPreloader(false);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo(0, 0);
          }, 1200); // Match animation duration
        }, 300);
      }
    }, 400);
    
    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!showPreloader) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Main Curtain with Curved Bottom */}
      <div
        className={`absolute inset-0 bg-black transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isAnimatingOut ? 'animate-curtain-up' : ''
        }`}
        style={{
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
          >
            {greetings[index]}
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