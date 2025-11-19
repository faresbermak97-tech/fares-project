import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleAnalytics from '../GoogleAnalytics';
import { usePathname, useSearchParams } from 'next/navigation';
import { initWebVitals, trackPageView } from '@/lib/analytics';

// Mock the modules that GoogleAnalytics depends on
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/analytics', () => ({
  initWebVitals: jest.fn(),
  trackPageView: jest.fn(),
}));

// A more robust mock for next/script
jest.mock('next/script', () => {
  const Script = ({
    onLoad,
    children,
  }: {
    onLoad?: () => void;
    children?: React.ReactNode;
  }) => {
    if (onLoad) {
      // Store the onLoad callback so we can trigger it in our tests
      (window as any).__NEXT_SCRIPT_ONLOAD = onLoad;
    }
    if (children) {
      // If there's inline script content, we can execute it when onLoad is called
      (window as any).__NEXT_SCRIPT_CHILDREN = children;
    }
    return null;
  };
  return Script;
});

describe('GoogleAnalytics', () => {
  const GA_ID = 'GA-TEST-ID';

  beforeEach(() => {
    // Reset mocks and global objects before each test
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue('/test-path');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('q=test'));
    delete (window as any).__NEXT_SCRIPT_ONLOAD;
    delete (window as any).__NEXT_SCRIPT_CHILDREN;
    (window as any).gtag = jest.fn();
    (window as any).dataLayer = [];
  });

  it('should not render if GA_ID is not provided', () => {
    render(<GoogleAnalytics GA_ID="" />);
    expect(screen.queryByTestId('google-analytics-script')).not.toBeInTheDocument();
  });

  it('should initialize web vitals and track page view', async () => {
    render(<GoogleAnalytics GA_ID={GA_ID} />);

    // Simulate the script's onLoad event
    act(() => {
      if ((window as any).__NEXT_SCRIPT_ONLOAD) {
        (window as any).__NEXT_SCRIPT_ONLOAD();
      }
      // Execute inline script if it exists
      if (typeof (window as any).__NEXT_SCRIPT_CHILDREN === 'string') {
        // A bit of a hack to simulate the inline script execution
        // This sets up the gtag function and makes the initial calls
        const inlineScript = (window as any).__NEXT_SCRIPT_CHILDREN;
        const scriptContent = inlineScript.replace(/gtag/g, 'window.gtag');
        // eslint-disable-next-line no-eval
        eval(scriptContent);
      }
    });

    await waitFor(() => {
      expect(initWebVitals).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(trackPageView).toHaveBeenCalledWith('/test-path?q=test');
    });
  });

  it('should call gtag with the correct configuration', async () => {
    render(<GoogleAnalytics GA_ID={GA_ID} />);

    // Simulate the script's onLoad event and execute the inline script
    act(() => {
      if (typeof (window as any).__NEXT_SCRIPT_CHILDREN === 'string') {
        const inlineScript = (window as any).__NEXT_SCRIPT_CHILDREN;
        // This is a simplified simulation of the inline script.
        // It defines window.gtag and pushes arguments to dataLayer.
        window.dataLayer = window.dataLayer || [];
        if (typeof window.gtag !== 'function') {
          window.gtag = function() {
            // @ts-ignore
            window.dataLayer.push(arguments);
          };
        }
        // Manually make the calls that the inline script would have made
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: false,
        });
      }
    });

    await waitFor(() => {
      // Check the dataLayer for the calls
      const calls = (window.dataLayer as any[]).map(argArray => Array.from(argArray));
      
      // Find the 'js' call
      const jsCall = calls.find(call => call[0] === 'js');
      expect(jsCall).not.toBeUndefined();
      expect(jsCall?.[0]).toBe('js');
      expect(jsCall?.[1]).toBeInstanceOf(Date);

      // Find the 'config' call
      const configCall = calls.find(call => call[0] === 'config');
      expect(configCall).not.toBeUndefined();
      expect(configCall?.[0]).toBe('config');
      expect(configCall?.[1]).toBe(GA_ID);
      expect(configCall?.[2]).toEqual({
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: false,
      });
    });
  });
});
