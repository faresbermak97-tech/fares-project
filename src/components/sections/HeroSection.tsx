'use client';

import { useEffect, useRef, useState } from 'react';
import { useCurrentTime } from '@/hooks/useCurrentTime';

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const currentTime = useCurrentTime();

  // Text animation effect
  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    let scrollPosition = 0;
    let lastTime = 0;
    let animationId: number;

    const scroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // Use time-based animation for smoother movement
      scrollPosition -= 0.15 * deltaTime;
      if (textElement) {
        textElement.style.transform = `translateX(${scrollPosition}px)`;

        // Reset position when text has scrolled completely
        if (Math.abs(scrollPosition) > textElement.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-black text-white px-4 py-2 rounded"
      >
        Skip to main content
      </a>

      {/* Fixed Menu Button - Visible when scrolled */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 w-14 h-14 rounded-full bg-black flex flex-col items-center justify-center gap-1.5 transition-all duration-300 opacity-0 -translate-y-4 pointer-events-none"
      >
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
      </button>

      {/* Menu Overlay - 1/4 screen dropdown */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-heading"
        className={`fixed top-20 right-6 md:right-8 z-40 bg-black/90 backdrop-blur-md rounded-3xl p-8 transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <h2 id="menu-heading" className="sr-only">Navigation Menu</h2>
        <div className="flex flex-col items-start gap-6">
          <a
            href="#work"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-label="Navigate to work section"
          >
            Work
          </a>
          <a
            href="#about"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-label="Navigate to about section"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-label="Navigate to contact section"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Overlay backdrop to close menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Navigation - Only visible in hero */}
      <nav aria-label="Main navigation" className="absolute top-0 left-0 right-0 z-30 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
        <div className="group cursor-default">
          <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 group-hover:px-6">
            <span className="text-base md:text-lg text-white group-hover:hidden">© Code by Fares</span>
            <span className="text-base md:text-lg text-white hidden group-hover:inline">© Fares Bermak</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <a href="#work" className="group relative flex flex-col items-center" aria-label="Navigate to work section">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
              <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">Work</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>
          <a href="#about" className="group relative flex flex-col items-center" aria-label="Navigate to about section">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
              <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">About</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>
          <a href="#contact" className="group relative flex flex-col items-center" aria-label="Navigate to contact section">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
              <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">Contact</span>
            </div>
            <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </a>
        </div>
      </nav>

      {/* Hero Image - Full Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image.jpg"
          alt="Fares Bermak"
          className="w-full h-full object-cover hero-image"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* Location Badge */}
      <div className="absolute -left-6 md:-left-18 top-1/2 -translate-y-1/2 z-20 hidden md:block">
        <div className="bg-black rounded-full px-8 py-2 flex items-center gap-5 shadow-lg">
          <div className="text-white text-sm leading-tight">
            <div>Located</div>
            <div>in</div>
            <div>Algeria</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 animate-spin-slow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5"/>
              <path d="M2 12h20M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10M12 2C9.5 4.5 8 8 8 12s1.5 7.5 4 10" stroke="black" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Freelance Badge - Top Right */}
      <div className="absolute right-6 md:right-16 top-[25%] md:top-[30%] z-20">
        <div className="text-white text-lg md:text-2xl lg:text-3xl leading-tight font-semibold text-left flex flex-col items-start">
          <div>Remote Virtual Assistant</div>
          <div>& Data Entry</div>
        </div>
      </div>

      {/* Scroll Indicator - Middle Right */}
      <div className="absolute right-6 md:right-12 lg:right-16 top-1/2 -translate-y-1/2 z-20 hidden sm:block">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center animate-bounce-slow">
          <svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:w-[30px] md:h-[30px]">
            <path d="M15 8L15 22M15 22L21 16M15 22L9 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Large Animated Text - Bottom */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 lg:bottom-24 left-0 right-0 z-10 w-full pointer-events-none overflow-hidden">
        <div
          ref={textRef}
          className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] font-extrabold text-white/90 leading-none whitespace-nowrap inline-block will-change-transform tracking-tighter transition-opacity duration-500 hover:text-white hover:opacity-100"
        >
          Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak —
        </div>
      </div>
    </section>
  );
}
