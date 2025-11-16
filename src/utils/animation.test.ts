import { prefersReducedMotion, createOptimizedAnimation, monitorAnimationPerformance, animationManager } from './animation';
import { gsap } from 'gsap';

// Mock GSAP
jest.mock('gsap', () => ({
  to: jest.fn().mockReturnValue({ kill: jest.fn() }),
  set: jest.fn(),
  killTweensOf: jest.fn(),
  globalTimeline: {
    clear: jest.fn(),
  },
}));

// Mock window and performance
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  })),
});

Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => 1000),
  },
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn(cb => setTimeout(cb, 16)),
});

describe('Animation Utils', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset animation manager
    animationManager.cleanup();
  });

  describe('prefersReducedMotion', () => {
    it('returns false when reduced motion is not preferred', () => {
      // Mock matchMedia to return false
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      expect(prefersReducedMotion()).toBe(false);
    });

    it('returns true when reduced motion is preferred', () => {
      // Mock matchMedia to return true for reduced motion
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      expect(prefersReducedMotion()).toBe(true);
    });

    it('returns false when window is undefined', () => {
      // Temporarily set window to undefined
      const originalWindow = global.window;
      delete (global as any).window;

      expect(prefersReducedMotion()).toBe(false);

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('createOptimizedAnimation', () => {
    it('creates optimized animation with default props', () => {
      const element = document.createElement('div');
      const animationProps = { opacity: 0 };

      createOptimizedAnimation(element, animationProps);

      // Check if gsap.to was called with optimized props
      expect(gsap.to).toHaveBeenCalledWith(element, {
        opacity: 0,
        force3D: true,
        transformPerspective: 1000,
      });
    });

    it('applies final state when reduced motion is preferred', () => {
      // Mock prefersReducedMotion to return true
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

      const element = document.createElement('div');
      const animationProps = { opacity: 0 };

      createOptimizedAnimation(element, animationProps);

      // Check if gsap.set was called instead of gsap.to
      expect(gsap.set).toHaveBeenCalledWith(element, animationProps);
      expect(gsap.to).not.toHaveBeenCalled();
    });
  });

  describe('monitorAnimationPerformance', () => {
    it('monitors FPS and logs warning when performance is low', () => {
      // Mock performance.now to simulate time passing
      let callCount = 0;
      performance.now = jest.fn(() => {
        callCount++;
        // Return increasing values to simulate time passing
        return 1000 + callCount * 100;
      });

      // Mock console.warn
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock document.documentElement
      Object.defineProperty(document, 'documentElement', {
        value: {
          setAttribute: jest.fn(),
        },
        writable: true,
      });

      monitorAnimationPerformance();

      // Fast-forward time to trigger FPS check
      jest.advanceTimersByTime(1100);

      // Check if warning was logged (simulating low FPS)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Animation performance warning:',
        expect.any(Number),
        'FPS'
      );

      // Check if low performance attribute was set
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
        'data-low-performance',
        'true'
      );

      // Restore console
      consoleSpy.mockRestore();
    });

    it('does nothing when window is undefined', () => {
      // Temporarily set window to undefined
      const originalWindow = global.window;
      delete (global as any).window;

      // Should not throw error
      expect(() => monitorAnimationPerformance()).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('AnimationManager', () => {
    it('adds and manages animations', () => {
      const element = document.createElement('div');
      const animation = { kill: jest.fn() };

      // Add animation
      animationManager.add('test-animation', animation);

      // Add another animation with same ID
      const anotherAnimation = { kill: jest.fn() };
      animationManager.add('test-animation', anotherAnimation);

      // Check if first animation was killed
      expect(animation.kill).toHaveBeenCalled();
    });

    it('adds and manages timelines', () => {
      const timeline = { kill: jest.fn() };

      // Add timeline
      animationManager.addTimeline('test-timeline', timeline);

      // Add another timeline with same ID
      const anotherTimeline = { kill: jest.fn() };
      animationManager.addTimeline('test-timeline', anotherTimeline);

      // Check if first timeline was killed
      expect(timeline.kill).toHaveBeenCalled();
    });

    it('removes specific animation or timeline', () => {
      const animation = { kill: jest.fn() };
      const timeline = { kill: jest.fn() };

      // Add animation and timeline
      animationManager.add('test-animation', animation);
      animationManager.addTimeline('test-timeline', timeline);

      // Remove specific animation
      animationManager.remove('test-animation');

      // Check if animation was killed
      expect(animation.kill).toHaveBeenCalled();

      // Remove specific timeline
      animationManager.remove('test-timeline');

      // Check if timeline was killed
      expect(timeline.kill).toHaveBeenCalled();
    });

    it('cleans up all animations and timelines', () => {
      const animation1 = { kill: jest.fn() };
      const animation2 = { kill: jest.fn() };
      const timeline1 = { kill: jest.fn() };
      const timeline2 = { kill: jest.fn() };

      // Add animations and timelines
      animationManager.add('animation1', animation1);
      animationManager.add('animation2', animation2);
      animationManager.addTimeline('timeline1', timeline1);
      animationManager.addTimeline('timeline2', timeline2);

      // Cleanup
      animationManager.cleanup();

      // Check if all animations and timelines were killed
      expect(animation1.kill).toHaveBeenCalled();
      expect(animation2.kill).toHaveBeenCalled();
      expect(timeline1.kill).toHaveBeenCalled();
      expect(timeline2.kill).toHaveBeenCalled();
    });
  });
});
