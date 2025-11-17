'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CardsSection.css';
import DetailModal from '@/components/DetailModal';
import { CardData } from '@/types';

const CardsSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to update card progress using CSS custom properties
  const updateCardProgress = useCallback((cardIndex: number, progress: number) => {
    const card = cardRefs.current[cardIndex];
    if (card) {
      card.style.setProperty('--progress', String(progress));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate when section enters viewport
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Start animation when section top hits viewport top
      if (sectionTop <= 0 && sectionTop > -sectionHeight + windowHeight) {
        // Calculate progress (0 to 1)
        const progress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (sectionTop > 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update card progress when scroll progress changes
  useEffect(() => {
    const card1Progress = Math.min(scrollProgress * 3, 1);
    const card2Progress = Math.min(Math.max((scrollProgress - 0.33) * 3, 0), 1);
    const card3Progress = Math.min(Math.max((scrollProgress - 0.66) * 3, 0), 1);

    updateCardProgress(0, card1Progress);
    updateCardProgress(1, card2Progress);
    updateCardProgress(2, card3Progress);
  }, [scrollProgress, updateCardProgress]);

  // Get card classes (no longer calculating progress classes)
  const getCardClasses = (cardIndex: number) => {
    return `card-${cardIndex + 1}`;
  };

  const cardData: CardData[] = [
    {
      id: 1,
      title: 'Virtual Assistant & Admin Support',
      description: 'Complete day-to-day operational support: calendar management, inbox organization, client communications, meeting prep, and document control. I keep your operations smooth so you can focus on strategy, not admin overhead.',
      image: '/Remote Virtual Assistance.jpg',
      bgColor: 'bg-pink-300',
      details: [
        'Email & Calendar Management - Organize inbox, schedule meetings across time zones, send reminders, ensure no conflicts',
        'Client Communication & Follow-ups - Manage routine emails, payment reminders, onboarding, maintain conversation logs',
        'Document Organization - Structure Google Drive/Dropbox, create naming conventions, organize files by project',
        'Meeting Preparation & Support - Prepare agendas, compile documents, take notes, distribute action items',
        'Task & Project Management - Manage Asana/Trello boards, update statuses, send progress reminders',
        'Travel & Event Coordination - Book flights/hotels, manage itineraries, coordinate logistics'
      ]
    },
    {
      id: 2,
      title: 'Data Entry & Management',
      description: 'Fast, accurate data capture with structured spreadsheets designed for analysis. I process 200-400+ records monthly with 99%+ accuracy. Invoice data, CRM updates, financial records—I deliver clean datasets using Excel and Google Sheets.',
      image: '/Data Entry.jpg',
      bgColor: 'bg-blue-300',
      details: [
        'High-Volume Data Entry - 200-400+ records monthly, invoice data, customer records, inventory lists, expense logs with validation checks',
        'CRM & Database Management - Input/update records in HubSpot, Salesforce, Pipedrive; clean duplicates, maintain consistency',
        'Spreadsheet Development - Custom Excel/Google Sheets templates with formulas, pivot tables, validation rules, automated calculations',
        'Financial Data Entry - Enter invoice data, expense records, transaction details into QuickBooks or spreadsheets for accountant review',
        'Report Generation - Compile data into clear reports with summaries, charts, insights (operational, sales, expense reports)',
        'Data Quality & Cleanup - Audit databases, identify errors, remove duplicates, standardize formatting, implement validation rules'
      ]
    },
    {
      id: 3,
      title: 'IT Support Help Desk L1',
      description: 'I help remote teams integrate software tools, manage cloud systems, and resolve technical issues quickly. From automation setup to day-to-day IT support, I make your systems efficient and dependable.',
      image: '/IT Support Help Desk L1.png',
      bgColor: 'bg-purple-300',
      details: [
        'Software Onboarding - Set up accounts, configure permissions, walk new team members through tools and access',
        'Basic Troubleshooting - Password resets, access issues, connectivity problems, software conflicts—resolved quickly to keep your team productive',
        'Cloud System Management - Help manage Google Workspace, Microsoft 365, configure sharing settings, organize cloud storage',
        'Tool Integration Support - Assist with connecting apps (Zapier setups, Google Workspace integrations) and document workflows',
        'Technical Documentation - Create simple guides and SOPs for common technical tasks and tool usage',
        'Tools Supported: Google Workspace, Microsoft Office 365, Slack, Zoom, Asana, Trello, QuickBooks Online, basic CRM platforms'
      ]
    }
  ];

  return (
    <div ref={sectionRef} className="cards-section relative bg-gray-50 full-height">
      {/* Sticky container */}
      <div 
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="cards-container relative h-full w-full flex items-center justify-center p-8 md:p-16">
          {cardData.map((card, index) => (
            <div
              key={card.id}
              ref={el => cardRefs.current[index] = el}
              className={`card absolute ${card.bgColor} rounded-3xl shadow-2xl transition-all duration-300 ease-out card-dimensions ${getCardClasses(index)}`}
            >
              <div className="card-content h-full flex flex-col lg:flex-row overflow-hidden rounded-3xl">
                {/* Left Content */}
                <div className="content-left flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">

                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                    {card.title}
                  </h2>

                  <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-xl leading-relaxed pl-1 md:pl-2">
                    {card.description}
                  </p>

                  {/* Detail Button */}
                  <div className="pl-1 md:pl-2">
                    <DetailModal 
                      title={card.title}
                      details={card.details}
                    />
                  </div>

                </div>
                {/* Right Image */}
                <div className="content-right flex-1 relative overflow-hidden min-h-[300px] lg:min-h-0">
                  <div className="absolute inset-4 lg:inset-8">
                    <img 
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-2xl shadow-xl"
                    />
                  </div>
                  <div className="absolute top-4 right-4 lg:top-8 lg:right-8 text-white text-6xl lg:text-9xl font-bold opacity-20 select-none">
                    0{card.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardsSection;