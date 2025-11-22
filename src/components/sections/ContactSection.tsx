'use client';

import { useState, useEffect, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormStatus {
  type: 'success' | 'error' | 'loading' | null;
  message: string;
}

export default function ContactCurtainSection() {
  const [currentTime, setCurrentTime] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus>({
    type: null,
    message: ''
  });

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
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('contact-curtain');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const openContactForm = () => {
    const form = document.getElementById('contact-form');
    if (form) {
      form.classList.remove('hidden');
      form.classList.add('flex');
      document.body.style.overflow = 'hidden';
      // Reset form state when opening
      setFormData({ name: '', email: '', message: '' });
      setFormStatus({ type: null, message: '' });
    }
  };

  const closeContactForm = () => {
    const form = document.getElementById('contact-form');
    if (form) {
      form.classList.add('hidden');
      form.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormStatus({
        type: 'error',
        message: 'Please fill in all fields.'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormStatus({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    // Set loading state
    setFormStatus({
      type: 'loading',
      message: 'Sending message...'
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({
          type: 'success',
          message: data.message || 'Message sent successfully!'
        });
        // Reset form
        setFormData({ name: '', email: '', message: '' });
        // Close form after 2 seconds
        setTimeout(() => {
          closeContactForm();
        }, 2000);
      } else {
        setFormStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (formStatus.type === 'error') {
      setFormStatus({ type: null, message: '' });
    }
  };

  return (
    <>
      {/* Curtain Transition */}
      <div className="relative h-32 bg-[#F7FAFC] overflow-hidden">
        <div 
          className={`absolute inset-0 bg-[#1A202C] transition-all duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{
            clipPath: isVisible 
              ? 'ellipse(200% 100% at 50% 100%)' 
              : 'ellipse(200% 100% at 50% 0%)'
          }}
        />
      </div>

      {/* Contact Section */}
      <section 
        id="contact-curtain" 
        className="relative bg-[#1A202C] text-white px-6 md:px-12 py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-8 mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gray-700">
                <img
                  src="/Profiel-pic.JPG"
                  alt="Fares Bermak"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-6xl md:text-8xl font-bold leading-none">
                Let's work
              </h1>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-none">
              together
            </h1>
          </div>

          {/* Divider with Button */}
          <div className="relative mb-12">
            <div className="w-full h-px bg-white/30" />
            
            <div className="absolute right-12 top-0 -translate-y-1/2">
              <button
                onClick={openContactForm}
                className="w-44 h-44 rounded-full bg-[#4D64FF] hover:bg-[#2B6CB0] flex items-center justify-center text-lg text-white transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Get in touch
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-6 mb-12">
            <a
              href="mailto:faresbermak97@gmail.com"
              className="contact-link group relative border border-white/40 rounded-full px-8 py-4 hover:border-[#4D64FF] transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100" />
              <span className="relative z-10 text-white">faresbermak97@gmail.com</span>
            </a>
            <a
              href="tel:+213542346579"
              className="contact-link group relative border border-white/40 rounded-full px-8 py-4 hover:border-[#4D64FF] transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-500 group-hover:scale-y-100" />
              <span className="relative z-10 text-white">+213 542 346 579</span>
            </a>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex justify-between">
              <div className="flex gap-12">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Version</h4>
                  <p>2026 © Edition</p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Local time</h4>
                  <p>{currentTime} GMT+1</p>
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Socials</h4>
                <div className="flex gap-8">
                  <a href="https://www.instagram.com/bermak_fares/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4D64FF] transition-colors">
                    Instagram
                  </a>
                  <a href="https://www.linkedin.com/in/faresbermak-va/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4D64FF] transition-colors">
                    LinkedIn
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
        className="hidden fixed inset-0 z-[100] bg-[#1A202C] items-center justify-center p-12"
      >
        <button
          onClick={closeContactForm}
          className="absolute top-12 right-12 text-white hover:opacity-60 transition-opacity text-5xl"
          disabled={formStatus.type === 'loading'}
        >
          ×
        </button>

        <div className="max-w-4xl w-full">
          <h3 className="text-6xl font-bold text-white mb-16">
            Get in touch
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-white text-sm mb-3 uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={formStatus.type === 'loading'}
                className="w-full bg-transparent border-b border-white/30 text-white text-2xl py-3 focus:outline-none focus:border-[#4D64FF] transition-colors disabled:opacity-50"
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={formStatus.type === 'loading'}
                className="w-full bg-transparent border-b border-white/30 text-white text-2xl py-3 focus:outline-none focus:border-[#4D64FF] transition-colors disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white text-sm mb-3 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                disabled={formStatus.type === 'loading'}
                rows={5}
                className="w-full bg-transparent border-b border-white/30 text-white text-2xl py-3 focus:outline-none focus:border-[#4D64FF] transition-colors resize-none disabled:opacity-50"
                placeholder="Your message..."
              />
            </div>

            {/* Status Message */}
            {formStatus.type && (
              <div className={`p-4 rounded-lg ${
                formStatus.type === 'success' ? 'bg-green-500/20 text-green-200' :
                formStatus.type === 'error' ? 'bg-red-500/20 text-red-200' :
                'bg-blue-500/20 text-blue-200'
              }`}>
                {formStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={formStatus.type === 'loading'}
              className="bg-[#4D64FF] hover:bg-[#2B6CB0] text-white px-12 py-4 rounded-full text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}