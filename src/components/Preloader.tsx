'use client';

import { useEffect, useState } from 'react';

export const greetings = [
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
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < greetings.length) {
        setIndex(currentIndex);
      } else {
        clearInterval(interval);
        setShowPreloader(false); // <-- REQUIRED FOR TEST
      }
    }, 400); // match your test timing EXACTLY
    
    return () => clearInterval(interval);
  }, []);

  if (!showPreloader) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center" suppressHydrationWarning={true}>
      <div className="text-white text-4xl md:text-6xl font-bold">
        {greetings[index]}
      </div>
    </div>
  );
}
