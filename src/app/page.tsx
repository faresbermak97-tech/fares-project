import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import CardsSection from '@/components/sections/CardsSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="bg-[#f5f5f5]">
      <HeroSection />
      <AboutSection />
      <CardsSection />
      <FeaturesSection />
      <ContactSection />
    </main>
  );
}
