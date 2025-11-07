'use client';

import { useEffect, useState } from 'react';

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
    if (index < greetings.length - 1) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setIsComplete(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  if (isComplete) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-white text-4xl md:text-6xl font-bold">
        {greetings[index]}
      </div>
    </div>
  );
}
