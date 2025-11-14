// Resource preloading utility for performance optimization

export const preloadAnimationAssets = async () => {
  // Preload animation libraries
  await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger')
  ]);
  
  // Preload animation assets
  const imagePromises = [
    preloadImage('/hero-image.jpg'),
    preloadImage('/about me pic.jpeg'),
    preloadImage('/Workflow Automation.jpg'),
    preloadImage('/Organization.jpg'),
    preloadImage('/Communication.png'),
    preloadImage('/IT Support Help Desk L1.png'),
    preloadImage('/Remote Virtual Assistance.jpg'),
    preloadImage('/Data Entry.jpg')
  ];

  await Promise.all(imagePromises);
  
  console.log('Animation assets preloaded');
};

// Helper function to preload an image
const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Note: Font preloading is now handled by Next.js through next/font/google in layout.tsx
// This function is kept for compatibility but no longer does manual font preloading
export const preloadFonts = () => {
  // Font preloading is handled by Next.js automatically
  console.log('Font preloading handled by Next.js');
};