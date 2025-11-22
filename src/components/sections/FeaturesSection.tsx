'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DetailModal from '@/components/DetailModal';

const features = [
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
  }
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);

  // CRITICAL FIX: Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // CRITICAL FIX: Initialize GSAP with proper cleanup
  useEffect(() => {
    if (!isClient) return;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // CRITICAL FIX: Wait for DOM to be ready
    const initTimeout = setTimeout(() => {
      setGsapReady(true);
    }, 100);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [isClient]);

  // CRITICAL FIX: Separate GSAP animation setup
  useEffect(() => {
    if (!isClient || !gsapReady) return;

    const triggers: ScrollTrigger[] = [];

    // CRITICAL FIX: Ensure elements exist before animating
    const validSlides = slidesRef.current.filter(slide => slide !== null);
    
    if (validSlides.length === 0) return;

    validSlides.forEach((slide, slideIndex) => {
      const text = slide.querySelector(".slide-text") as HTMLElement;
      const img = slide.querySelector(".slide-img") as HTMLElement;

      if (!text || !img) return;

      // Set initial state
      gsap.set(text, { opacity: 0, x: 60 });
      gsap.set(img, { opacity: 0, x: -60 });

      // Text animation
      const textTrigger = ScrollTrigger.create({
        trigger: slide,
        start: `${slideIndex * 100}vh center`,
        end: `${(slideIndex + 1) * 100}vh center`,
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(text, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(text, {
            opacity: 0,
            x: 60,
            duration: 1,
            ease: "power3.out"
          });
        }
      });
      triggers.push(textTrigger);

      // Image animation
      const imgTrigger = ScrollTrigger.create({
        trigger: slide,
        start: `${slideIndex * 100}vh center`,
        end: `${(slideIndex + 1) * 100}vh center`,
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(img, {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(img, {
            opacity: 0,
            x: -60,
            duration: 1,
            ease: "power3.out"
          });
        }
      });
      triggers.push(imgTrigger);
    });

    // Progress line animation
    if (progressLineRef.current && sectionRef.current) {
      const progressTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
        onUpdate: (self) => {
          if (progressLineRef.current) {
            gsap.set(progressLineRef.current, {
              height: `${self.progress * 100}%`,
            });
          }
        }
      });
      triggers.push(progressTrigger);
    }

    // CRITICAL FIX: Cleanup function
    return () => {
      // Kill all triggers
      triggers.forEach(trigger => trigger.kill());
      
      // Reset GSAP animations
      const slides = slidesRef.current;
      if (slides) {
        slides.forEach(slide => {
          if (slide) {
            gsap.killTweensOf(slide.querySelector('.slide-text'));
            gsap.killTweensOf(slide.querySelector('.slide-img'));
          }
        });
      }
      
      // Kill progress line animation
      const progressLine = progressLineRef.current;
      if (progressLine) {
        gsap.killTweensOf(progressLine);
      }
    };
  }, [isClient, gsapReady]);

  // Server-side rendering fallback
  if (!isClient) {
    return (
      <section id="features" className="triple-section" role="region" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">Features</h2>
        {features.map((s, i) => (
          <div key={i} className={`slide ${s.reverse ? "reverse" : ""}`}>
            <div className="slide-img">
              <img src={s.img} alt={s.highlight} />
            </div>
            <div className="divider" />
            <div className="slide-text">
              <h2>
                <span className="accent">{s.highlight}</span>
              </h2>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section id="features" className="triple-section" ref={sectionRef} role="region" aria-labelledby="features-heading">
      <h2 id="features-heading" className="sr-only">Features</h2>
      
      {/* Timeline elements */}
      <div className="timeline-line">
        <div className="timeline-progress" ref={progressLineRef}></div>
      </div>
      <div className="timeline-dot timeline-dot-top-1"></div>
      <div className="timeline-dot timeline-dot-top-2"></div>
      <div className="timeline-dot timeline-dot-top-3"></div>

      {features.map((s, i) => (
        <div
          key={i}
          className={`slide ${s.reverse ? "reverse" : ""}`}
          ref={(el) => {
            if (el) slidesRef.current[i] = el;
          }}
        >
          <div className="slide-img">
            <img src={s.img} alt={s.highlight} />
          </div>
          <div className="divider" />
          <div className="slide-text">
            <h2>
              <span className="accent">{s.highlight}</span>
            </h2>
            <p>{s.text}</p>
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
