import { useState, useRef, useEffect, memo } from 'react';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { throttle } from '@/utils/optimization';

interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

const ContactSection = memo(() => {
  const [lineAnimated, setLineAnimated] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>({ type: null, message: '' });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animate line when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setLineAnimated(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="animate-section relative bg-[#141414] text-white px-2 md:px-6 lg:px-8 pt-8 md:pt-16 pb-2">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Content */}
          <div className="mb-6 md:mb-8">
            <div className="mb-8 md:mb-12 lg:mb-16">
              {/* Profile Picture and Title */}
              <div className="flex items-center gap-6 md:gap-8 mb-2">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden flex-shrink-0 bg-gray-700">
                  <OptimizedImage
                    src="/Profiel-pic.JPG"
                    alt="Fares Bermak"
                    className="w-full h-full object-cover"
                    width={150}
                    height={150}
                    style={{ objectFit: "cover" }}
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
                  onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                      contactForm.classList.remove('hidden');
                      contactForm.classList.add('flex');
                      if (document.body) {
                        document.body.style.overflow = 'hidden';
                      }
                    }
                  }}
                  onMouseMove={throttle((e: React.MouseEvent<HTMLButtonElement>) => {
                    const btn = buttonRef.current;
                    if (!btn) return;
                    const rect = btn.getBoundingClientRect();
                    const x = Math.max(-40, Math.min(40, e.clientX - rect.left - rect.width / 2));
                    const y = Math.max(-10, Math.min(10, e.clientY - rect.top - rect.height / 2));
                    setButtonPosition({ x: x * 0.8, y: y * 0.5 });
                  }, 16)}
                  onMouseLeave={(_e: React.MouseEvent<HTMLButtonElement>) => {
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
                    <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-700 ease-&lsqb;cubic-bezier(0.19,1,0.22,1)&rsqb; group-hover:scale-y-100"></span>
                    <span className="relative z-10 inline-block text-white transition-all duration-500 ease-out group-hover:text-white">
                      faresbermak97@gmail.com
                    </span>
                  </a>
                  <a
                    href="tel:+213542346579"
                    className="contact-link group relative inline-block border border-white/40 rounded-full px-6 md:px-8 py-3 md:py-4 text-sm md:text-base overflow-hidden transition-all duration-300 hover:border-[#4D64FF]"
                  >
                    <span className="absolute inset-0 bg-[#4D64FF] rounded-full scale-y-0 origin-bottom transition-transform duration-700 ease-&lsqb;cubic-bezier(0.19,1,0.22,1)&rsqb; group-hover:scale-y-100"></span>
                    <span className="relative z-10 inline-block text-white transition-all duration-500 ease-out group-hover:text-white">
                      +213 542 346 579
                    </span>
                  </a>
                </div>

                {/* Mobile button */}
                <button
                  onClick={(_e: React.MouseEvent<HTMLButtonElement>) => {
                    const contactForm = document.getElementById('contact-form');
                    if (contactForm) {
                      contactForm.classList.remove('hidden');
                      contactForm.classList.add('flex');
                      if (document.body) {
                        document.body.style.overflow = 'hidden';
                      }
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
              if (document.body) {
                document.body.style.overflow = 'auto';
              }
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
                    if (document.body) {
                      document.body.style.overflow = 'auto';
                    }
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
                name="name"
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
                name="email"
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
                name="message"
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
    </>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;