import React, { useState } from 'react';
import { X } from 'lucide-react';
import './DetailModal.css';

interface CardDetailModalProps {
  title: string;
  details: string[];
  imageSrc?: string;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ 
  title, 
  details, 
  imageSrc 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to create a dynamic CSS class name based on the image source
  const getImageClassName = () => {
    if (!imageSrc) return '';
    
    // Extract filename from path
    const filename = imageSrc.split('/').pop()?.split('.')[0];
    if (!filename) return '';
    
    // Convert to a valid CSS class name
    return `modal-background-image-${filename.replace(/[^a-zA-Z0-9]/g, '')}`;
  };

  return (
    <>
      {/* Detail Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/70 hover:bg-black/80 backdrop-blur-md border border-black/50 hover:border-black/70 transition-all duration-300 text-white text-sm font-medium"
      >
        <span>See details</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Modal */}
      {isOpen && (
        <div className="modal-container">
          <div
            className={`modal-content modal-background-image has-bg-image ${getImageClassName()} ${imageSrc ? 'modal-with-bg-image' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              title="Close"
              className="close-button"
            >
              <X size={24} />
            </button>

            {/* Content */}
            <div className="modal-body">
              {/* Header */}
              <div className="modal-header">
                <h2 className="modal-title">{title}</h2>
                <div className="modal-divider" />
              </div>

              {/* Details List */}
              <div className="modal-details">
                {details.map((detail, idx) => (
                  <div key={idx} className={`detail-item detail-item-${idx % 10}`}>
                    <span className="detail-bullet">•</span>
                    <p className="detail-text">
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
};

export default CardDetailModal;
