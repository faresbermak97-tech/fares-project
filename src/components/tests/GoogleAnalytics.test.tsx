import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleAnalytics from '../GoogleAnalytics';

// Mock the gtag function
Object.defineProperty(window, 'gtag', {
  value: jest.fn(),
});

describe('GoogleAnalytics', () => {
  beforeEach(() => {
    (window.gtag as jest.Mock).mockClear();
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
    expect(window.gtag).toHaveBeenCalledWith('js', expect.any(Date));
    expect(window.gtag).toHaveBeenCalledWith('config', 'GA-TEST-ID');
  });
});
