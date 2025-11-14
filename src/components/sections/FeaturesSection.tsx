'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from '@/components/shared/OptimizedImage';
import DetailModal from '@/components/modals/DetailModal';
import { prefersReducedMotion, monitorAnimationPerformance, animationManager } from '@/utils/animation';

export default function FeaturesSection() {
  const [activeService, setActiveService] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);
  const servicesRef = useRef<HTMLElement>(null);
  const imageParallaxRef = useRef<HTMLDivElement>(null);
  const [serviceCardsVisible, setServiceCardsVisible] = useState<boolean[]>([false, false, false]);
  const [featureVisible, setFeatureVisible] = useState<boolean[]>([false, false, false]);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

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
    gsap.registerPlugin(ScrollTrigger);
    
    // Check for reduced motion preference
    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) {
      console.log('Reduced motion detected, simplifying animations');
    }
    
    // Start performance monitoring
    monitorAnimationPerformance();

    // Store ScrollTrigger instances for cleanup
    const scrollTriggers: ScrollTrigger[] = [];

    // Animate text + image on scroll
    slidesRef.current.forEach((slide) => {
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
      animationManager.add(`text-${slidesRef.current.indexOf(slide)}`, textAnimation);
      
      const textTrigger = ScrollTrigger.create({
        trigger: slide,
        start: () => {
          const index = slidesRef.current.indexOf(slide);
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
      animationManager.add(`img-${slidesRef.current.indexOf(slide)}`, imgAnimation);
      
      const imgTrigger = ScrollTrigger.create({
        trigger: slide,
        start: () => {
          const index = slidesRef.current.indexOf(slide);
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
  );
}