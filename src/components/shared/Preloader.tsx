'use client';

import { useEffect, useState } from 'react';
import { preloadAnimationAssets, preloadFonts } from '@/utils/preloader';

const greetings = [
  'Hello',
  'Bonjour',
  'Ciao',
  'Hola',
  'مرحبا', // Arabic
  'Привет', // Russian
  'こんにちは', // Japanese
  'Guten Tag',
  'Olá',
  'Namaste',
];

export default function Preloader() {
  const [index, setIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Preload animation assets and fonts
    const initPreloading = async () => {
      try {
        await preloadAnimationAssets();
        preloadFonts();
      } catch (error) {
        console.error('Error preloading resources:', error);
      }
    };
    
    initPreloading();

    if (index < greetings.length - 1) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, 150); // Reduced timeout for faster preloader
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsComplete(true);
      }, 300); // Reduced final timeout
      return () => clearTimeout(timeout);
    }
  }, [index]);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-white text-4xl md:text-6xl font-bold transition-opacity duration-150">
        {greetings[index]}
      </div>
    </div>
  );
}
