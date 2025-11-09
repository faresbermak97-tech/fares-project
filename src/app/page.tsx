'use client';

import { useEffect, useRef, useState } from 'react';
import './page.css';
import CardsSection from './CardsSection';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <div className="absolute right-6 md:right-16 top-[25%] md:top-[30%] z-20 text-right">
          <div className="text-white text-lg md:text-2xl lg:text-3xl leading-tight font-semibold">
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
                    I am Fares Bermak
                  </span>
                </h2>
              </div>
              
              <div className="overflow-hidden">
                <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed animate-fade-in-up animation-delay-200">
                  Meticulous remote Administrative Professional focused on high-accuracy data management and process automation. 
                  Proven at converting local operations into reliable digital workflows, automating repetitive tasks with Zapier 
                  and Advanced Excel, and maintaining strict data integrity across financial and operational records. Trilingual 
                  (Arabic, English, French) with strong asynchronous collaboration experience.
                </p>
              </div>
              
            </div> {/* This closes the "space-y-8" container */}

            {/* Right Side - Image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl animate-fade-in-right">
                <img
                  src="/about me pic.jpeg"
                  alt="Fares Bermak - Professional Profile"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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

      {/* Services Section - Horizontal Panels */}
<section id="services" className="panels-premium animate-section relative h-screen w-full flex overflow-hidden">
  {/* Panel 1 - Remote Virtual Assistance */}
  <div className="relative w-1/3 h-full overflow-hidden group cursor-pointer">
    <img
      src="/Remote Virtual Assistance.jpg"
      alt="Remote Virtual Assistance"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
    
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wider">
        REMOTE VIRTUAL
        <br />
        ASSISTANCE
      </h3>
      
      <div className="text-white/90 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-md">
        <p className="text-lg">Calendar management</p>
        <p className="text-lg">Email handling</p>
        <p className="text-lg">Client coordination</p>
        <p className="text-lg">Document organization</p>
      </div>
    </div>
  </div>

  {/* Panel 2 - Data Entry */}
  <div className="relative w-1/3 h-full overflow-hidden group cursor-pointer">
    <img
      src="/Data Entry.jpg"
      alt="Data Entry"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
    
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wider">
        DATA ENTRY
      </h3>
      
      <div className="text-white/90 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-md">
        <p className="text-lg">Excel & Google Sheets</p>
        <p className="text-lg">Database management</p>
        <p className="text-lg">Record organization</p>
        <p className="text-lg">Accuracy & speed</p>
      </div>
    </div>
  </div>

  {/* Panel 3 - IT Support */}
  <div className="relative w-1/3 h-full overflow-hidden group cursor-pointer">
    <img
      src="/IT Support Help Desk L1.png"
      alt="IT Support Help Desk L1"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />
    
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <h3 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-wider">
        IT SUPPORT
        <br />
        HELP DESK L1
      </h3>
      
      <div className="text-white/90 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-md">
        <p className="text-lg">Software integration</p>
        <p className="text-lg">Cloud systems</p>
        <p className="text-lg">Technical support</p>
        <p className="text-lg">System automation</p>
      </div>
    </div>
  </div>
</section>

{/* Mobile Version - Stack Vertically */}
<section id="services-mobile" className="md:hidden relative w-full">
  {[
    {
      title: "REMOTE VIRTUAL\nASSISTANCE",
      image: "/Remote Virtual Assistance.jpg",
      services: ["Calendar management", "Email handling", "Client coordination", "Document organization"]
    },
    {
      title: "DATA ENTRY",
      image: "/Data Entry.jpg",
      services: ["Excel & Google Sheets", "Database management", "Record organization", "Accuracy & speed"]
    },
    {
      title: "IT SUPPORT\nHELP DESK L1",
      image: "/IT Support Help Desk L1.png",
      services: ["Software integration", "Cloud systems", "Technical support", "System automation"]
    }
  ].map((panel, idx) => (
    <div key={idx} className="relative h-screen w-full overflow-hidden">
      <img
        src={panel.image}
        alt={panel.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h3 className="text-white text-3xl sm:text-4xl font-bold mb-6 tracking-wider whitespace-pre-line">
          {panel.title}
        </h3>
        
        <div className="text-white/90 space-y-2 max-w-sm">
          {panel.services.map((service, i) => (
            <p key={i} className="text-base">{service}</p>
          ))}
        </div>
      </div>
    </div>
  ))}
</section>

      {/* Flow Section - How I Keep Your Business Flowing */}
      <section id="flow" className="animate-section relative py-24 md:py-32 lg:py-40 px-6 md:px-12 lg:px-16 bg-[#f8fafc] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-20 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111] mb-4">How I Keep Your Business Flowing</h2>
            <p className="text-[#555] max-w-3xl mx-auto">Automation, organization, and clear communication—built to keep teams moving.</p>
          </div>

          <div className="space-y-14 md:space-y-20">
            {/* Row 1 - Automation */}
            <FeatureRow
              index={0}
              title="Workflow Automation"
              description="I design intelligent automations that eliminate repetitive manual tasks and connect your essential tools—from Google Workspace to Zapier. By streamlining processes like data transfers, email triggers, and task creation, I help your systems work together seamlessly—saving hours every week and letting you focus on growth."
              image="Workflow Automation.jpg"
              reverse={false}
              visible={featureVisible[0]}
            />

            {/* Row 2 - Organization */}
            <FeatureRow
              index={1}
              title="Organization"
              description="I bring structure to your digital workspace by creating clear systems for managing data, schedules, and workflows. From organized spreadsheets and shared drives to project dashboards and reporting templates, I make everything accessible, consistent, and simple to maintain."
              image="Organization.jpg"
              reverse={true}
              visible={featureVisible[1]}
            />

            {/* Row 3 - Communication */}
            <FeatureRow
              index={2}
              title="Communication"
              description="Smooth communication is the backbone of any remote team. I manage inboxes, coordinate updates, and ensure clear information flow between departments and clients—via Slack, email, or project tools like Asana—so everyone stays aligned and focused on results."
              image="Communication.png"
              reverse={false}
              visible={featureVisible[2]}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="animate-section relative bg-[#141414] text-white px-2 md:px-6 lg:px-8 pt-8 md:pt-16 pb-2">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Content */}
          <div className="mb-6 md:mb-8">
            <div className="mb-8 md:mb-12 lg:mb-16">
              {/* Profile Picture and Title */}
              <div className="flex items-center gap-6 md:gap-8 mb-2">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden flex-shrink-0 bg-gray-700">
                  <img
                    src="/Profiel-pic.JPG"
                    alt="Fares Bermak"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none text-white">
                  Let's work
                </h1>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-none text-white">
                together
              </h1>
            </div>

            {/* Divider Line with Centered Button */}
            <div className="relative mb-8 md:mb-12">
              {/* Horizontal Dividing Line */}
              <div className="relative w-full h-px overflow-hidden">
                <div 
                  className={`h-full bg-white/30 origin-left transition-transform duration-700 ease-out ${
                    lineAnimated ? 'scale-x-100' : 'scale-x-0'
                  }`}
                ></div>
              </div>

              {/* Get in touch button - Centered on Line - Desktop */}
              <div className="hidden lg:block absolute right-8 xl:right-12 top-0">
                <button
                  ref={buttonRef}
                  onClick={() => {
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                      contactForm.classList.remove('hidden');
                      contactForm.classList.add('flex');
                      document.body.style.overflow = 'hidden';
                    }
                  }}
                  onMouseMove={(e) => {
                    const btn = buttonRef.current;
                    if (!btn) return;
                    const rect = btn.getBoundingClientRect();
                    const x = Math.max(-40, Math.min(40, e.clientX - rect.left - rect.width / 2));
                    const y = Math.max(-10, Math.min(10, e.clientY - rect.top - rect.height / 2));
                    setButtonPosition({ x: x * 0.8, y: y * 0.5 });
                  }}
                  onMouseLeave={() => {
                    setButtonPosition({ x: 0, y: 0 });
                  }}
                  className={`contact-button w-40 h-40 lg:w-44 lg:h-44 rounded-full bg-[#4D64FF] hover:bg-[#3d50cc] flex items-center justify-center text-base lg:text-lg text-white transition-all duration-300 cursor-pointer hover:scale-105 ${buttonPosition.x !== 0 || buttonPosition.y !== 0 ? 'button-moved' : ''}`}
                >
                  <span className="inline-block hover:animate-pulse">Get in touch</span>
                </button>
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="relative">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Email and Phone */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                  <a 
                    href="mailto:faresbermak97@gmail.com" 
                    className="contact-link group relative inline-block border border-white/40 rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base overflow-hidden transition-all duration-300 hover:border-[#4D64FF]"
                  >
                    <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100"></span>
                    <span className="relative z-10 inline-block text-white transition-all duration-500 ease-out group-hover:text-white">
                      faresbermak97@gmail.com
                    </span>
                  </a>
                  <a 
                    href="tel:+213542346579" 
                    className="contact-link group relative inline-block border border-white/40 rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base overflow-hidden transition-all duration-300 hover:border-[#4D64FF]"
                  >
                    <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100"></span>
                    <span className="relative z-10 inline-block text-white transition-all duration-500 ease-out group-hover:text-white">
                      +213 542 346 579
                    </span>
                  </a>
                </div>

                {/* Mobile button */}
                <button
                  onClick={() => {
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                      contactForm.classList.remove('hidden');
                      contactForm.classList.add('flex');
                      document.body.style.overflow = 'hidden';
                    }
                  }}
                  className="lg:hidden w-40 h-40 rounded-full bg-[#4D64FF] hover:bg-[#3d50cc] flex items-center justify-center text-base transition-all duration-300 hover:scale-105"
                >
                  Get in touch
                </button>
              </div>
            </div>
          </div>

          {/* Footer - minimal spacing */}
          <div className="border-t border-white/10 pt-2 mt-4 md:mt-6 pb-1">
            <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
              <div className="flex flex-col sm:flex-row gap-6 md:gap-12">
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Version</h4>
                  <p className="text-sm md:text-base">2026 © Edition</p>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Local time</h4>
                  <p className="text-sm md:text-base">{currentTime} GMT+1</p>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] md:text-xs uppercase tracking-wider text-gray-500 mb-1">Socials</h4>
                <div className="flex gap-6 md:gap-8">
                  <a 
                    href="https://www.instagram.com/bermak_fares/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative text-sm md:text-base transition-all duration-300"
                  >
                    <span className="inline-block transition-all duration-300 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_2px_0_rgba(255,255,255,0.3)]">
                      Instagram
                    </span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/faresbermak-va/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative text-sm md:text-base transition-all duration-300"
                  >
                    <span className="inline-block transition-all duration-300 group-hover:-translate-y-0.5 group-hover:drop-shadow-[0_2px_0_rgba(255,255,255,0.3)]">
                      LinkedIn
                    </span>
                    <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <div
        id="contact-form"
        className="hidden fixed inset-0 z-[100] bg-black items-center justify-center p-6 md:p-12"
      >
        <button
          onClick={() => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
              contactForm.classList.add('hidden');
              contactForm.classList.remove('flex');
              document.body.style.overflow = 'auto';
            }
          }}
          className="absolute top-6 right-6 md:top-12 md:right-12 text-white hover:opacity-60 transition-opacity text-4xl md:text-5xl"
          aria-label="Close"
        >
          ×
        </button>

        <div className="max-w-4xl w-full">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-12 md:mb-16">
            Get in touch
          </h3>

          <form className="space-y-8" onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            
            const formData = new FormData(e.currentTarget);
            const name = formData.get('name') as string;
            const email = formData.get('email') as string;
            const message = formData.get('message') as string;
            
            try {
              const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                setFormStatus({
                  type: 'success',
                  message: 'Your message has been sent successfully!'
                });
                // Reset form
                e.currentTarget.reset();
                // Close form after a short delay
                setTimeout(() => {
                  const contactForm = document.getElementById('contact-form');
                  if (contactForm) {
                    contactForm.classList.add('hidden');
                    contactForm.classList.remove('flex');
                    document.body.style.overflow = 'auto';
                    // Reset form status when closing
                    setFormStatus({ type: null, message: '' });
                  }
                }, 2000);
              } else {
                setFormStatus({
                  type: 'error',
                  message: data.error || 'Failed to send your message. Please try again.'
                });
              }
            } catch (error) {
              setFormStatus({
                type: 'error',
                message: 'An unexpected error occurred. Please try again.'
              });
            } finally {
              setIsSubmitting(false);
            }
          }}>
            <div>
              <label htmlFor="name" className="block text-white text-sm mb-3 uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white text-sm mb-3 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white text-sm mb-3 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full bg-transparent border-b border-white/30 text-white text-xl md:text-2xl py-3 focus:outline-none focus:border-white transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            <div className="mt-8">
              {formStatus.type && (
                <div className={`mb-4 p-4 rounded-lg ${
                  formStatus.type === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {formStatus.message}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black px-12 py-4 rounded-full text-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// FeatureRow component
interface FeatureRowProps {
  index: number;
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  visible: boolean;
}

function FeatureRow({ index, title, description, image, reverse, visible }: FeatureRowProps) {
  return (
    <div
      data-feature={index}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
        reverse ? 'lg:[&>div:first-child]:order-2' : ''
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ease-out will-change-transform ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        } ${visible ? `transition-delay-${index * 150}` : 'transition-delay-1'}`}
      >
        <img src={image} alt={title} className="w-full h-[320px] md:h-[420px] lg:h-[480px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/80 text-xs font-medium text-[#111] backdrop-blur-sm">
          {title}
        </div>
      </div>

      {/* Text */}
      <div
        className={`transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        } ${visible ? `transition-delay-${index * 200 + 100}` : 'transition-delay-1'}`}
      >
        <h3 className="text-3xl md:text-4xl font-semibold text-[#111] mb-4">{title}</h3>
        <p className="text-[#555] text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Service Card Component with animations and effects
interface ServiceCardProps {
  index: number;
  image: string;
  title: string;
  description: string;
  isVisible: boolean;
}

function ServiceCard({ index, image, title, description, isVisible }: ServiceCardProps) {
  return (
    <div
      data-service-card={index}
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } hover:shadow-2xl hover:-translate-y-2 ${isVisible ? `transition-delay-${index * 150}` : 'transition-delay-1'}`}
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Decorative Accent */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#4D64FF]/20 backdrop-blur-sm group-hover:bg-[#4D64FF]/40 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-[#111] mb-4 group-hover:text-[#4D64FF] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[#555] leading-relaxed text-base md:text-lg">
          {description}
        </p>
        
        {/* Hover Indicator */}
        <div className="mt-6 flex items-center gap-2 text-[#4D64FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium uppercase tracking-wider">Learn More</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform group-hover:translate-x-1 transition-transform duration-300"
          >
            <path
              d="M5 15L15 5M15 5H7M15 5V13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Animated Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#4D64FF]/30 transition-colors duration-500 pointer-events-none"></div>
    </div>
  );
}

// Horizontal panels component for the services section
function HorizontalPanels() {
  const panelClass = () =>
    `relative w-1/3 h-screen overflow-hidden`;

  const imgClass = () =>
    `absolute inset-0 w-full h-full object-cover`;

  const overlayClass = (idx: number) =>
    `absolute inset-0 bg-black/20`;

  const contentClass = (idx: number) =>
    `absolute inset-0 flex flex-col items-center justify-center text-center px-6`;

  const titleClass = (idx: number) =>
    `text-white drop-shadow-md text-4xl md:text-6xl lg:text-7xl font-bold`;

  const subtitleClass = (idx: number) =>
    `mt-6 text-white/90 text-sm md:text-base max-w-xl mx-auto`;

  return (
    <div className="animate-section relative flex w-full h-screen">
      {/* Panel 1 */}
      <div className={panelClass()}>
        <img src="/hero-image.jpg" alt="Art Direction" className={imgClass()} />
        <div className={overlayClass(0)} />
        <div className={contentClass(0)}>
          <h3 className={titleClass(0)}>COMMUNICATIE</h3>
          <p className={subtitleClass(0)}>Sterke merkcommunicatie en zichtbaarheid zonder fulltime team.</p>
        </div>
      </div>

      {/* Panel 2 */}
      <div className={panelClass()}>
        <img src="/about me pic.jpeg" alt="UI/UX Design" className={imgClass()} />
        <div className={overlayClass(1)} />
        <div className={contentClass(1)}>
          <h3 className={titleClass(1)}>ORGANISATIE</h3>
          <p className={subtitleClass(1)}>Structuur, planning en soepele uitvoering voor je dagelijkse workflow.</p>
        </div>
      </div>

      {/* Panel 3 */}
      <div className={panelClass()}>
        <img src="/Profiel-pic.JPG" alt="Web Development" className={imgClass()} />
        <div className={overlayClass(2)} />
        <div className={contentClass(2)}>
          <h3 className={titleClass(2)}>ADMINISTRATIE</h3>
          <p className={subtitleClass(2)}>Nauwkeurige backoffice en financiële processen, volledig ontzorgd.</p>
        </div>
      </div>
    </div>
  );
}
