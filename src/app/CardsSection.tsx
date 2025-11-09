import React, { useState, useEffect, useRef } from 'react';

const CardsSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

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

  // Calculate card positions based on scroll progress
  const getCardStyle = (cardIndex) => {
    const card1Progress = Math.min(scrollProgress * 3, 1);
    const card2Progress = Math.min(Math.max((scrollProgress - 0.33) * 3, 0), 1);
    const card3Progress = Math.min(Math.max((scrollProgress - 0.66) * 3, 0), 1);

    if (cardIndex === 0) {
      return {
        transform: `scale(${1 - card1Progress * 0.05}) translateY(0%)`,
        opacity: 1,
        zIndex: 1
      };
    } else if (cardIndex === 1) {
      return {
        transform: `scale(${1 - card2Progress * 0.05}) translateY(${100 - card2Progress * 100}%)`,
        opacity: 1,
        zIndex: 2
      };
    } else {
      return {
        transform: `scale(1) translateY(${100 - card3Progress * 100}%)`,
        opacity: 1,
        zIndex: 3
      };
    }
  };

  const cardData = [
    {
      id: 1,
      title: 'Remote Virtual Assistance',
      description: 'Comprehensive support — managing calendars, emails, clients, and documents to keep your operations running smoothly.',
      image: '/Remote Virtual Assistance.jpg',
      bgColor: 'bg-pink-300'
    },
    {
      id: 2,
      title: 'Data Entry',
      description: 'Accurate and organized data handling using Excel and Google Sheets to keep your records reliable and decision-ready.',
      image: '/Data Entry.jpg',
      bgColor: 'bg-blue-300'
    },
    {
      id: 3,
      title: 'IT Support Help Desk L1',
      description: 'I help remote teams integrate software tools, manage cloud systems, and resolve technical issues quickly.From automation setup to day-to-day IT support, I make your systems efficient and dependable.',
      image: '/IT Support Help Desk L1.png',
      bgColor: 'bg-purple-300'
    }
  ];

  return (
    <div ref={sectionRef} className="cards-section relative bg-gray-50" style={{ height: '400vh' }}>
      {/* Sticky container */}
      <div 
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <div className="cards-container relative h-full w-full flex items-center justify-center p-8 md:p-16">
          {cardData.map((card, index) => (
            <div
              key={card.id}
              className={`card absolute ${card.bgColor} rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ease-out`}
              style={{
                width: 'calc(100% - 2cm)',
                height: 'calc(100% - 4cm)',
                maxWidth: '1400px',
                ...getCardStyle(index)
              }}
            >
              <div className="card-content h-full flex flex-col lg:flex-row">
                {/* Left Content */}
                <div className="content-left flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center">

                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                    {card.title}
                  </h2>

                  <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 max-w-xl leading-relaxed pl-1 md:pl-2">
                    {card.description}
                  </p>


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
