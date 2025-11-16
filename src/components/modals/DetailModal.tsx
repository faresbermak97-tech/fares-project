// src/components/CardDetailModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CardDetailModalProps {
  title: string;
  details: string[];
  imageSrc?: string; // Made optional with ?
  ariaLabel?: string;
}

export default function CardDetailModal({ title, details, imageSrc = "", ariaLabel }: CardDetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Start expansion animation
      setIsExpanding(true);
      
      // Show content after expansion
      const contentTimer = setTimeout(() => {
        setShowContent(true);
      }, 800);

      return () => clearTimeout(contentTimer);
    } else {
      // Reset states when closing
      setIsExpanding(false);
      setShowContent(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (imageSrc) {
      document.documentElement.style.setProperty('--modal-bg-image', `url(${imageSrc})`);
    }
  }, [imageSrc]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <>
      {/* Detail Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-md border border-black/50 hover:border-black/70 transition-all duration-300 text-white text-sm font-medium"
        aria-label={ariaLabel || `View details about ${title}`}
      >
        <span>Detail</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              showContent ? 'opacity-100 z-[60]' : 'opacity-0 z-[60]'
            }`}
            onClick={handleClose}
            aria-label="Close modal"
          />

          {/* Expanding Image Background */}
          <div
            className={`fixed inset-0 z-[70] flex items-center justify-center transition-all duration-700 ease-out ${
              isExpanding ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Liquid Glass Image Container */}
            <div
              className={`relative transition-all duration-1000 ease-out ${
                isExpanding
                  ? 'w-full h-full'
                  : 'w-[500px] h-[400px]'
              }`}
            >
              {/* Blurred Background Image */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 modal-background-image modal-background-image-${(imageSrc || "").replace(/[^a-zA-Z0-9]/g, '')} ${
                  isExpanding ? 'modal-background-image-blurred' : 'modal-background-image-normal'
                } ${imageSrc ? 'has-bg-image' : ''}`}
              />

              {/* Liquid Glass Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-1000 ${
                  isExpanding
                    ? 'bg-gradient-to-br from-white/10 via-white/5 to-black/20 backdrop-blur-3xl'
                    : 'bg-transparent backdrop-blur-0'
                }`}
              />

              {/* Shimmer Effect */}
              {isExpanding && (
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Modal */}
          <div
            className={`fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none transition-all duration-500 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto pointer-events-auto transition-all duration-500 ${
                showContent ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-3xl rounded-3xl border border-white/40 shadow-2xl" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                title="Close modal"
                className="sticky top-4 left-full z-20 p-3 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-lg border border-black/50 transition-all duration-300 text-white hover:scale-110 ml-auto mr-4"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                    {title}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
                </div>

                {/* Details List */}
                <ul className="space-y-4 pb-4" role="list">
                  {details.map((detail, idx) => (
                    <li
                      key={idx}
                      className={`text-white/90 flex items-start gap-3 transition-all duration-500 ${
                        showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      } detail-item-${idx}`}
                    >
                      <span className="text-white/60 text-lg leading-relaxed mt-0.5" aria-hidden="true">•</span>
                      <p className="text-base md:text-lg leading-relaxed">
                        {detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scrollbar styling is now in DetailModal.css */}
            </div>
          </div>
        </>
      )}
    </>
  );
}