'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animationManager } from '@/utils/animation';
import './page.css';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ContactFormModal from '@/components/modals/ContactFormModal';
import OptimizedImage from '@/components/shared/OptimizedImage';
import DetailModal from '@/components/modals/DetailModal';

// Dynamically import heavy components
const CardsSection = dynamic(() => import('@/components/sections/CardsSection'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>,
  ssr: false
});

const ResultsSection = dynamic(() => import('@/components/sections/ResultsSection'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>,
  ssr: false
});

const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>,
  ssr: false
});

const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  loading: () => <div className="h-96 flex items-center justify-center">Loading...</div>,
  ssr: false
});

export default function Home() {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [lineAnimated, setLineAnimated] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  
  // Apply transform to button based on position
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate(${buttonPosition.x}px, ${buttonPosition.y}px) translateY(-50%)`;
    }
  }, [buttonPosition]);
  const [activeService, setActiveService] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const servicesRef = useRef<HTMLElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);
  const [serviceCardsVisible, setServiceCardsVisible] = useState<boolean[]>([false, false, false]);
  const [featureVisible, setFeatureVisible] = useState<boolean[]>([false, false, false]);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Debounce function to limit how often a function can be called
  const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Use debounced version of scroll handler for better performance
    const debouncedScrollHandler = debounce(handleScroll, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', debouncedScrollHandler);
  }, []);

  // Observe service text blocks and set active image index for sticky crossfade
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLElement>('[data-service-index]');
    if (!blocks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = (entry.target as HTMLElement).dataset.serviceIndex;
            const idx = idxAttr ? parseInt(idxAttr, 10) : 0;
            setActiveService(idx);
            setRevealed((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      {
        // Trigger when the block is near the center of viewport
        root: null,
        threshold: 0.5,
        rootMargin: '-20% 0px -30% 0px',
      }
    );

    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, []);

  // Subtle parallax for the sticky image so it gently follows scroll
  useEffect(() => {
    const onScroll = () => {
      const section = servicesRef.current;
      const imageEl = imageParallaxRef.current;
      if (!section || !imageEl) return;
      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const start = viewportH * 0.1; // when top is 10% from top
      const end = rect.height - viewportH * 0.2; // before section end
      const progressRaw = ((start - rect.top) / end);
      const progress = Math.max(0, Math.min(1, progressRaw));
      const translateY = (progress - 0.5) * 40; // -20px to +20px
      imageEl.style.transform = `translateY(${translateY}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Africa/Algiers',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLineAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => observer.disconnect();
  }, []);

  // Observe service cards for fade-in animation
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-service-card]');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.serviceCard || '0', 10);
            setServiceCardsVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Observe feature rows for reveal animation
  useEffect(() => {
    const rows = document.querySelectorAll<HTMLElement>('[data-feature]');
    if (!rows.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.feature || '0', 10);
            setFeatureVisible((prev) => {
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    let scrollPosition = 0;
    let lastTime = 0;
    const scroll = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      // Use time-based animation for smoother movement
      scrollPosition -= 0.15 * deltaTime; // Increased speed from 0.05 to 0.15
      if (textElement) {
        // Enhance parallax effect with page scroll
        const parallaxEffect = scrollY * 0.15;
        const totalTransform = scrollPosition - parallaxEffect;
        textElement.style.transform = `translateX(${totalTransform}px)`;
        
        // Reset position when text has scrolled completely
        if (Math.abs(scrollPosition) > textElement.scrollWidth / 2) {
          scrollPosition = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    const animation = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animation);
  }, [scrollY]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Store ScrollTrigger instances for cleanup
    const scrollTriggers: ScrollTrigger[] = [];
    
    // Animate text + image on scroll
    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      const text = slide.querySelector(".slide-text") as HTMLElement;
      const img = slide.querySelector(".slide-img") as HTMLElement;
      
      // Create and store text animation
      const textAnimation = gsap.to(text, {
        opacity: 0,
        x: 60,
        duration: 1,
        ease: "power3.out",
        force3D: true,
        transformPerspective: 1000
      });
      
      // Store animation in manager
      animationManager.add(`text-${index}`, textAnimation);
      
      const textTrigger = ScrollTrigger.create({
        trigger: slide,
        start: () => {
          return `${index * 100}vh center`;
        },
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(text, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            transformPerspective: 1000
          });
        },
        onLeaveBack: () => {
          gsap.to(text, {
            opacity: 0,
            x: 60,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            transformPerspective: 1000
          });
        }
      });
      scrollTriggers.push(textTrigger);
      
      // Create and store image animation
      const imgAnimation = gsap.to(img, {
        opacity: 0,
        x: -60,
        duration: 1,
        ease: "power3.out",
        force3D: true,
        transformPerspective: 1000
      });
      
      // Store animation in manager
      animationManager.add(`img-${index}`, imgAnimation);
      
      const imgTrigger = ScrollTrigger.create({
        trigger: slide,
        start: () => {
          return `${index * 100}vh center`;
        },
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(img, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            transformPerspective: 1000
          });
        },
        onLeaveBack: () => {
          gsap.to(img, {
            opacity: 0,
            x: -60,
            duration: 1,
            ease: "power3.out",
            force3D: true,
            transformPerspective: 1000
          });
        }
      });
      scrollTriggers.push(imgTrigger);
    });
    
    // Create progress line animation
    const progressAnimation = gsap.to(progressLineRef.current, {
      height: "0%",
      duration: 0,
      ease: "none",
      force3D: true
    });
    
    // Store animation in manager
    animationManager.add('progress-line', progressAnimation);
    
    // Create and store progress line animation
    const progressTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(progressLineRef.current, {
          height: `${self.progress * 100}%`,
          duration: 0,
          ease: "none",
          force3D: true
        });
      }
    });
    scrollTriggers.push(progressTrigger);
    
    // Create batch animation timeline for better performance
    const batchTimeline = gsap.timeline({
      paused: true,
      force3D: true
    });
    
    // Add animations to timeline
    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;
      const text = slide.querySelector(".slide-text") as HTMLElement;
      const img = slide.querySelector(".slide-img") as HTMLElement;
      
      if (text) {
        batchTimeline.to(text, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
          transformPerspective: 1000
        }, index * 0.1);
      }
      
      if (img) {
        batchTimeline.to(img, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
          force3D: true,
          transformPerspective: 1000
        }, index * 0.1);
      }
    });
    
    // Store timeline in manager
    animationManager.addTimeline('batch-animations', batchTimeline);
    
    // Cleanup function to kill all ScrollTriggers and animations
    return () => {
      scrollTriggers.forEach(trigger => trigger.kill());
      ScrollTrigger.refresh();
      
      // Clean up animations
      animationManager.cleanup();
    };
  }, []);

  return (
    <main className="bg-[#f5f5f5]">
      {/* Fixed Menu Button - Visible when scrolled */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`fixed top-6 right-6 md:top-8 md:right-8 z-50 w-14 h-14 rounded-full bg-black flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
          scrollY > 100 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-label="Menu"
      >
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-white rounded-full"></span>
      </button>

      {/* Menu Overlay - 1/4 screen dropdown */}
      <div
        className={`fixed top-20 right-6 md:right-8 z-40 bg-black/90 backdrop-blur-md rounded-3xl p-8 transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col items-start gap-6">
          <a
            href="#work"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            Work
          </a>
          <a
            href="#about"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#contact"
            className="text-2xl md:text-3xl text-white hover:opacity-60 transition-opacity"
            onClick={() => setMenuOpen(false)}
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

      {/* Hero Section */}
      <section className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Navigation - Only visible in hero */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
          <div className="group cursor-default">
            <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 transition-all duration-300 group-hover:px-6">
              <span className="text-base md:text-lg text-white group-hover:hidden">© Code by Fares</span>
              <span className="text-base md:text-lg text-white hidden group-hover:inline">© Fares Bermak</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <a href="#work" className="group relative flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
                <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">Work</span>
              </div>
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
            <a href="#about" className="group relative flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
                <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">About</span>
              </div>
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
            <a href="#contact" className="group relative flex flex-col items-center">
              <div className="bg-black/60 backdrop-blur-md rounded-full px-5 py-2 transition-all hover:bg-black/80">
                <span className="text-base md:text-lg text-white group-hover:animate-shake inline-block">Contact</span>
              </div>
              <span className="mt-2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
          </div>
        </nav>
        {/* Hero Image - Full Background */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/hero-image.jpg"
            alt="Fares Bermak"
            className="w-full h-full object-cover hero-image"
            priority={true}
            style={{ objectPosition: "center 20%" }}
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
            Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak — Fares Bermak —
          </div>
        </div>
      </section>

{/* About Section */}
      <section id="about" className="animate-section relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-16 bg-[#f5f5f5] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <div className="overflow-hidden">
                <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fade-in-up">
                  <span className="inline-block hover:text-[#4D64FF] transition-colors duration-300">
                    Who I Am
                  </span>
                </h2>
              </div>
              
              <div className="overflow-hidden">
                <div className="space-y-6 animate-fade-in-up animation-delay-200">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                    I'm Fares Bermak, a disciplined Remote Administrative Professional who converts chaotic manual processes into dependable digital systems.
                  </p>

                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                    I specialize in high-accuracy data management, workflow automation with Zapier and Advanced Excel, and maintaining strict integrity across financial and operational records.
                  </p>

                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                    Trilingual (Arabic, English, French) with proven experience in asynchronous remote collaboration, I've helped businesses eliminate hours of repetitive work each week while reducing errors and improving team coordination.
                  </p>

                  <div className="pt-4 border-l-4 border-[#4D64FF] pl-6 bg-white/50 py-4 rounded-r-lg">
                    <p className="text-lg md:text-xl text-gray-900 font-medium italic leading-relaxed">
                      My approach is simple: Build systems that work reliably, automate what shouldn't require human attention, and keep everything organized so your business scales without friction.
                    </p>
                  </div>
                </div>
              </div>
              
            </div> {/* This closes the "space-y-8" container */}

            {/* Right Side - Image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in-right">
                <OptimizedImage
                  src="/about me pic.jpeg"
                  alt="Fares Bermak - Professional Profile"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  width={800}
                  height={600}
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4D64FF] rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#4D64FF] rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <CardsSection />

      {/* Scroll-Triggered Features Section */}
<section id="features" className="triple-section" ref={sectionRef}>
  {/* fixed center timeline */}
  <div className="timeline-line">
    <div className="timeline-progress" ref={progressLineRef}></div>
  </div>
  {/* glowing dots */}
  <div className="timeline-dot timeline-dot-top-1"></div>
  <div className="timeline-dot timeline-dot-top-2"></div>
  <div className="timeline-dot timeline-dot-top-3"></div>

  {[
    {
      highlight: "Workflow Automation",
      text: "I design smart automations that eliminate repetitive manual tasks and connect your essential tools—from Google Workspace to Zapier integrations. By streamlining processes like data transfers, email triggers, and task creation, I save your team 5-15 hours weekly and allow you to focus on growth instead of routine.",
      img: "/Workflow Automation.jpg",
      reverse: false,
      details: [
        'Auto-import email purchase orders → Google Sheets with categorization',
        'New CRM contact → Welcome email + calendar invite + task in Asana',
        'Invoice sent → Automatic 7-day follow-up reminder if unpaid',
        'Form submission → Data added to spreadsheet + Slack notification',
        'Calendar event → Meeting prep doc auto-created in Google Drive',
        'Result: 5-15 hours saved weekly per client'
      ]
    },
    {
      highlight: "Organization",
      text: "I bring structure to your digital workspace by creating clear systems for managing data, schedules, and workflows. From organized spreadsheets and shared drives to project dashboards and reporting templates, I ensure everything is accessible, consistent, and easy to maintain.",
      img: "/Organization.jpg",
      reverse: true,
      details: [
        'Google Drive/Dropbox folder structures with naming conventions',
        'Excel/Sheets workbooks with validation, formulas, pivot tables',
        'Project dashboards in Asana/Trello with status tracking',
        'Standard operating procedures (SOPs) documentation',
        'Email templates for common scenarios',
        'Client/vendor contact databases - Find any file in under 30 seconds'
      ]
    },
    {
      highlight: "Communication",
      text: "Smooth communication is the backbone of any remote team. I manage inboxes, coordinate updates, and ensure information flows clearly between departments and clients. Whether through Slack, email, or project platforms like Asana, I help teams stay aligned and focused on results.",
      img: "/Communication.png",
      reverse: false,
      details: [
        'Inbox filtering and priority flagging (Inbox Zero daily)',
        'Client email responses with your tone/voice',
        'Meeting scheduling across multiple time zones',
        'Follow-up tracking to ensure no missed replies',
        'Internal team updates via Slack/email',
        'Cross-department coordination - Response Time: Within 4 hours'
      ]
    },
  ].map((s, i) => (
    <div
      key={i}
      className={`slide ${s.reverse ? "reverse" : ""}`}
      ref={(el) => {
        if (el) slidesRef.current[i] = el;
      }}
    >
      <div className="slide-img">
        <OptimizedImage 
          src={s.img} 
          alt={s.highlight} 
          width={500}
          height={400}
          className="w-full h-full rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="divider" />
      <div className="slide-text">
        <h2>
          <span className="accent">{s.highlight}</span>
        </h2>
        <p>{s.text}</p>
        
        {/* ADD THIS: Detail Button */}
        <div className="mt-8">
          <DetailModal 
            title={s.highlight}
            details={s.details}
          />
        </div>
      </div>
    </div>
  ))}
</section>    

<ResultsSection />
<PricingSection />
<ContactSection />

    </main>
  );
}