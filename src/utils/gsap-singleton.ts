import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let isGSAPInitialized = false;

/**
 * Initialize GSAP and register plugins only once
 */
export function initGSAP() {
  // Only initialize on client side
  if (typeof window === 'undefined') return;

  if (!isGSAPInitialized) {
    gsap.registerPlugin(ScrollTrigger);
    isGSAPInitialized = true;
  }
}

/**
 * Clean up all ScrollTrigger instances
 */
export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
}

/**
 * Create an animation and return a cleanup function
 */
export function createAnimation(createAnimationFn: () => gsap.core.Tween) {
  initGSAP();
  const animation = createAnimationFn();

  return () => {
    animation.kill();
  };
}
