"use client";

import dynamic from 'next/dynamic';

// Disable SSR for ContactSection to prevent hydration errors
const ContactSection = dynamic(() => import('@/components/sections/ContactSection'), {
  ssr: false
});

export default function ContactSectionWrapper() {
  return <ContactSection />;
}