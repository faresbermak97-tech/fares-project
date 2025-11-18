import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initGSAP, cleanupScrollTriggers, createAnimation } from '../gsap-singleton';

// Mock window object
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

describe('GSAP Singleton', () => {
  beforeEach(() => {
    // Reset GSAP state before each test
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    jest.clearAllMocks();
  });

  describe('initGSAP', () => {
    it('should register ScrollTrigger plugin once', () => {
      const registerPluginSpy = jest.spyOn(gsap, 'registerPlugin');

      initGSAP();
      expect(registerPluginSpy).toHaveBeenCalledWith(ScrollTrigger);
      expect(registerPluginSpy).toHaveBeenCalledTimes(1);

      // Second call should not register again
      initGSAP();
      expect(registerPluginSpy).toHaveBeenCalledTimes(1);
    });

    it('should not register plugins on server', () => {
      const originalWindow = global.window;
      delete (global as Record<string, unknown>).window;

      const registerPluginSpy = jest.spyOn(gsap, 'registerPlugin');
      initGSAP();
      expect(registerPluginSpy).not.toHaveBeenCalled();

      global.window = originalWindow;
    });
  });

  describe('cleanupScrollTriggers', () => {
    it('should kill all ScrollTrigger instances', () => {
      // Add mock elements to the DOM
      document.body.innerHTML = '<div class="test"></div><div class="test2"></div>';

      // Create some ScrollTrigger instances
      ScrollTrigger.create({
        trigger: '.test',
        start: 'top top',
      });
      ScrollTrigger.create({
        trigger: '.test2',
        start: 'top top',
      });

      expect(ScrollTrigger.getAll()).toHaveLength(2);

      cleanupScrollTriggers();
      expect(ScrollTrigger.getAll()).toHaveLength(0);

      // Clean up the DOM
      document.body.innerHTML = '';
    });
  });

  describe('createAnimation', () => {
    it('should initialize GSAP and create animation', () => {
      const mockAnimation = { kill: jest.fn() };
      const createAnimationFn = jest.fn().mockReturnValue(mockAnimation);

      const cleanup = createAnimation(createAnimationFn);

      expect(createAnimationFn).toHaveBeenCalled();
      expect(typeof cleanup).toBe('function');
    });

    it('should return cleanup function that kills animation', () => {
      const mockAnimation = { kill: jest.fn() };
      const createAnimationFn = jest.fn().mockReturnValue(mockAnimation);

      const cleanup = createAnimation(createAnimationFn);
      cleanup();

      expect(mockAnimation.kill).toHaveBeenCalled();
    });
  });
});
