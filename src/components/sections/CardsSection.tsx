"use client";


import "./CardsSection.css";

import { useEffect, useRef, useState } from "react";

interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  details: string[];
}

function CardsSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const cardData: CardData[] = [
    {
      id: 1,
      title: "Virtual Assistant & Admin Support",
      description:
        "Complete day-to-day operational support: calendar management, inbox organization, client communications, meeting prep, and document control.",
      image: "/Remote Virtual Assistance.jpg",
      bgColor: "bg-gradient-to-br from-blue-400 via-blue-300 to-cyan-200", // Vibrant blue gradient
      details: [
        "Email & Calendar Management",
        "Client Communication & Follow-ups",
        "Document Organization",
        "Meeting Preparation & Support",
        "Task & Project Management",
        "Travel & Event Coordination",
      ],
    },
    {
      id: 2,
      title: "Data Entry & Management",
      description:
        "Fast, accurate data capture with structured spreadsheets designed for analysis. 200-400+ records monthly with 99%+ accuracy.",
      image: "/Data Entry.jpg",
      bgColor: "bg-gradient-to-br from-emerald-400 via-teal-300 to-green-200", // Vibrant green gradient
      details: [
        "High-Volume Data Entry - 200-400+ records monthly",
        "CRM & Database Management",
        "Spreadsheet Development",
        "Financial Data Entry",
        "Report Generation",
        "Data Quality & Cleanup",
      ],
    },
    {
      id: 3,
      title: "IT Support Help Desk L1",
      description:
        "Remote teams integration software tools, manage cloud systems, and resolve technical issues quickly.",
      image: "/IT Support Help Desk L1.png",
      bgColor: "bg-gradient-to-br from-purple-400 via-violet-300 to-indigo-200", // Vibrant purple gradient
      details: [
        "Software Onboarding",
        "Basic Troubleshooting",
        "Cloud System Management",
        "Tool Integration Support",
        "Technical Documentation",
        "Tools: Google Workspace, Office 365, Slack, Zoom, Asana",
      ],
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      if (sectionTop <= 0 && sectionTop > -sectionHeight + windowHeight) {
        const progress = Math.abs(sectionTop) / (sectionHeight - windowHeight);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (sectionTop > 0) {
        setScrollProgress(0);
      } else {
        setScrollProgress(1);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const getCardStyle = (cardIndex: number) => {
    const card1Progress = Math.min(scrollProgress * 3, 1);
    const card2Progress = Math.min(Math.max((scrollProgress - 0.33) * 3, 0), 1);
    const card3Progress = Math.min(Math.max((scrollProgress - 0.66) * 3, 0), 1);

    const progress = [card1Progress, card2Progress, card3Progress][cardIndex];
    const scale = 1 - (progress || 0) * 0.05;

    if (cardIndex === 0) {
      return {
        transform: `scale(${scale}) translateY(0)`,
        zIndex: 1,
        opacity: 1,
      };
    } else if (cardIndex === 1) {
      const translateY = (1 - card2Progress) * 100;
      return {
        transform: `scale(${scale}) translateY(${translateY}%)`,
        zIndex: 2,
        opacity: 1,
      };
    } else {
      const translateY = (1 - card3Progress) * 100;
      return {
        transform: `scale(1) translateY(${translateY}%)`,
        zIndex: 3,
        opacity: 1,
      };
    }
  };

  return (
    <>
      <div ref={sectionRef} className="relative bg-gray-50" style={{ height: "400vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="relative h-full w-full flex items-center justify-center p-8 md:p-16">
            {cardData.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`absolute ${card.bgColor} rounded-3xl shadow-2xl transition-all duration-300 ease-out`}
                style={{
                  width: "calc(100% - 2cm)",
                  height: "calc(100% - 4cm)",
                  maxWidth: "1400px",
                  ...getCardStyle(index),
                }}
              >
                <div className="h-full flex flex-col lg:flex-row overflow-hidden rounded-3xl">
                  <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                      {card.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-800 mb-6 md:mb-8 max-w-xl leading-relaxed font-medium">
                      {card.description}
                    </p>
                    <button
                      onClick={() => setActiveModal(card.id)}
                      className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-md border border-black/50 hover:border-black/70 transition-all duration-300 text-white text-sm font-medium w-fit"
                    >
                      <span>Detail</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 relative overflow-hidden min-h-[300px] lg:min-h-0">
                    <div className="absolute inset-4 lg:inset-8">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover rounded-2xl shadow-xl"
                        width={500}
                        height={500}
                      />
                    </div>
                    <div className="absolute top-4 right-4 lg:top-8 lg:right-8 text-black/10 text-6xl lg:text-9xl font-bold select-none">
                      0{card.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveModal(null)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/40" />

              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-lg border border-black/50 transition-all duration-300 text-white hover:scale-110"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="relative z-10 p-8 md:p-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {cardData[activeModal ? activeModal - 1 : 0]?.title}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-white/60 to-transparent rounded-full mb-6" />

                <ul className="space-y-3">
                  {cardData[activeModal ? activeModal - 1 : 0]?.details.map((detail, idx) => (
                    <li key={idx} className="text-white/90 flex items-start gap-3">
                      <span className="text-white/60 text-lg leading-relaxed mt-0.5">•</span>
                      <p className="text-base md:text-lg leading-relaxed">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CardsSection;
