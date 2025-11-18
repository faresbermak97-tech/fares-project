import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleAnalytics from '../GoogleAnalytics';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({
    src,
    id,
    children,
    strategy,
    dangerouslySetInnerHTML,
  }: {
    src: string;
    id?: string;
    children?: React.ReactNode;
    strategy?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) {
    // If dangerouslySetInnerHTML is provided, execute it
    if (dangerouslySetInnerHTML && dangerouslySetInnerHTML.__html) {
      // Create a function from the string and execute it
      // This is a simplified execution and might not cover all edge cases
      // but should work for gtag initialization.
      try {
        // eslint-disable-next-line no-eval
        eval(dangerouslySetInnerHTML.__html);
      } catch (e) {
        console.error("Error executing dangerouslySetInnerHTML in mock Script:", e);
      }
    }

    return (
      // eslint-disable-next-line @next/next/no-sync-scripts
      <script
        data-testid={id || 'script'}
        src={src}
        data-strategy={strategy}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    );
  };
});

// Mock analytics functions
jest.mock('@/lib/analytics', () => ({
  initWebVitals: jest.fn(),
  trackPageView: jest.fn(),
}));

// Mock Next.js router hooks
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('GoogleAnalytics', () => {
  // Add this: Mock gtag before each test
  beforeEach(() => {
    window.dataLayer = []; // Initialize dataLayer
    window.gtag = jest.fn(function(...args: any[]) {
      window.dataLayer.push(...args); // Push arguments to dataLayer
    });
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  // Add this: Clean up the DOM after each test
  afterEach(() => {
    cleanup();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('renders script tag with correct src', () => {
    render(<GoogleAnalytics GA_ID="GA-TEST-ID" />);
    const script = document.querySelector('script');
    expect(script).toHaveAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=GA-TEST-ID');
  });

  it('does not render without GA_ID', () => {
    render(<GoogleAnalytics GA_ID="" />);
    const script = document.querySelector('script');
    expect(script).toBeNull();
  });

  it('initializes gtag with correct config', () => {
    render(<GoogleAnalytics GA_ID="GA-TEST-ID" />);
    
    // Wait for useEffect to run
    expect(window.gtag).toHaveBeenCalledWith('js', expect.any(Date));
    expect(window.gtag).toHaveBeenCalledWith('config', 'GA-TEST-ID', {
      page_title: expect.any(String),
      page_location: expect.any(String),
      send_page_view: false
    });
  });
});
