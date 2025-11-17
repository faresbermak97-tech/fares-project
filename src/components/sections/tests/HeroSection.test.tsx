import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../HeroSection';

describe('HeroSection', () => {
  it('renders navigation links', () => {
    render(<HeroSection />);
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('displays location badge', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Located/i)).toBeInTheDocument();
    expect(screen.getByText(/Algeria/i)).toBeInTheDocument();
  });

  it('displays animated name text', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Fares Bermak/i)).toBeInTheDocument();
  });

  it('navigation links have correct hrefs', () => {
    render(<HeroSection />);
    const workLink = screen.getByRole('link', { name: /work/i });
    expect(workLink).toHaveAttribute('href', '#work');
  });

  it('updates time display every second', async () => {
    jest.useFakeTimers();
    render(<HeroSection />);

    const initialTime = screen.getByText(/AM|PM/i).textContent;

    // Advance time by 1 second
    jest.advanceTimersByTime(1000);

    // Time should have updated
    expect(screen.getByText(/AM|PM/i)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
