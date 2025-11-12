// src/components/DetailModal.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface DetailModalProps {
  title: string;
  icon?: string;
  details: string[];
}

export default function DetailModal({ title, icon, details }: DetailModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Detail Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-md border border-black/50 hover:border-black/70 transition-all duration-300 text-white text-sm font-medium"
      >
        <span>Detail</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div
            className="relative w-full max-w-xl rounded-4xl shadow-2xl transform transition-all duration-500 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-3xl rounded-4xl border border-white/40" />

            {/* Shimmer Effect */}
            <div className="absolute inset-0 rounded-4xl opacity-40">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-lg border border-black/50 transition-all duration-300 text-white hover:scale-110"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              {/* Header */}
              <div className="mb-6">
                {icon && <span className="text-6xl md:text-7xl mb-2 inline-block">{icon}</span>}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                  {title}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-white/60 to-transparent rounded-full" />
              </div>

              {/* Details List */}
              <div className="space-y-3">
                {details.map((detail, idx) => (
                  <div key={idx} className="text-white/90 flex items-start gap-3">
                    <span className="text-white/60 text-lg leading-relaxed mt-0.5">•</span>
                    <p className="text-base md:text-lg leading-relaxed">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}