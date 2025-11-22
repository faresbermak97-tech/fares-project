import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CardsSection from '@/components/sections/CardsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import dynamic from 'next/dynamic';

// Create a client component wrapper for the ContactSection
const ContactSectionWrapper = dynamic(() => import('@/components/ContactSectionWrapper'), {
  loading: () => <div className="relative h-32 bg-[#F7FAFC] overflow-hidden" />
});

export default function Home() {
  return (
    <main className="bg-[#f5f5f5]">
      <HeroSection />
      <AboutSection />
      <CardsSection />
      <FeaturesSection />
      <ContactSectionWrapper />
    </main>
  );
}