// Animation utilities with performance optimizations
import { gsap } from 'gsap';

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Create animation with reduced motion support
export const createOptimizedAnimation = (
  element: HTMLElement,
  animationProps: gsap.TweenVars
) => {
  if (prefersReducedMotion()) {
    // For users who prefer reduced motion, just set the final state
    return gsap.set(element, animationProps);
  }

  // Add performance optimizations
  const optimizedProps = {
    ...animationProps,
    force3D: true,
    transformPerspective: 1000,
  };

  return gsap.to(element, optimizedProps);
};

// Monitor animation performance
export const monitorAnimationPerformance = () => {
  if (typeof window === 'undefined') return;

  let lastTime = performance.now();
  let frames = 0;
  
  const checkFPS = () => {
    frames++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));

      if (fps < 55) {
        console.warn('Animation performance warning:', fps, 'FPS');
        
        // Disable complex animations on low-end devices
        document.documentElement.setAttribute('data-low-performance', 'true');
      }

      frames = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  };
  
  checkFPS();
};

// Animation manager for better memory management
export class AnimationManager {
  private animations: Map<string, gsap.core.Tween> = new Map();
  private timelines: Map<string, gsap.core.Timeline> = new Map();

  add(id: string, animation: gsap.core.Tween) {
    // Kill existing animation if present
    if (this.animations.has(id)) {
      this.animations.get(id)?.kill();
    }
    this.animations.set(id, animation);
  }

  addTimeline(id: string, timeline: gsap.core.Timeline) {
    // Kill existing timeline if present
    if (this.timelines.has(id)) {
      this.timelines.get(id)?.kill();
    }
    this.timelines.set(id, timeline);
  }

  remove(id: string) {
    const animation = this.animations.get(id);
    if (animation) {
      animation.kill();
      this.animations.delete(id);
    }
    
    const timeline = this.timelines.get(id);
    if (timeline) {
      timeline.kill();
      this.timelines.delete(id);
    }
  }

  cleanup() {
    this.animations.forEach(animation => animation.kill());
    this.timelines.forEach(timeline => timeline.kill());
    this.animations.clear();
    this.timelines.clear();
  }
}

// Create a singleton instance
export const animationManager = new AnimationManager();