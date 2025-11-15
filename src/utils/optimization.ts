// Performance optimization utilities

// Throttle function to limit how often a function can be called
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce function to delay execution until after a wait period
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Intersection Observer with default options
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = { threshold: 0.2 }
) => {
  return new IntersectionObserver(callback, options);
};

// Optimized scroll listener with passive event
export const addOptimizedScrollListener = (
  callback: () => void,
  options: { throttleMs?: number; debounceMs?: number } = {}
) => {
  const { throttleMs = 16, debounceMs = 0 } = options;

  let optimizedCallback: () => void;

  if (debounceMs > 0) {
    optimizedCallback = debounce(callback, debounceMs);
  } else {
    optimizedCallback = throttle(callback, throttleMs);
  }

  window.addEventListener('scroll', optimizedCallback, { passive: true });

  return () => {
    window.removeEventListener('scroll', optimizedCallback);
  };
};

// Resize observer with debouncing
export const createResizeObserver = (
  callback: () => void,
  debounceMs: number = 100
) => {
  const debouncedCallback = debounce(callback, debounceMs);

  const observer = new ResizeObserver(debouncedCallback);

  return {
    observer,
    disconnect: () => observer.disconnect(),
    observe: (element: Element) => observer.observe(element),
    unobserve: (element: Element) => observer.unobserve(element)
  };
};

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T) => {
  const cache = new Map();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
};
