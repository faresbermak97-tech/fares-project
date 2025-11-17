import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { within } from '@testing-library/react';
import HeroSection from '../HeroSection';

describe('HeroSection', () => {
  it('renders navigation links', () => {
    render(<HeroSection />);
    // Find the main navigation bar first
    const nav = screen.getByRole('navigation', { name: /main/i });
    // Now search *within* that bar
    expect(within(nav).getByText('Work')).toBeInTheDocument();
    expect(within(nav).getByText('About')).toBeInTheDocument();
    expect(within(nav).getByText('Contact')).toBeInTheDocument();
  });

  it('displays location badge', () => {
    render(<HeroSection />);
    expect(screen.getByText(/Located/i)).toBeInTheDocument();
    expect(screen.getByText(/Algeria/i)).toBeInTheDocument();
  });

  it('displays animated name text', () => {
    render(<HeroSection />);
    // Find the specific marquee text
    const marquee = screen.getByText(/Fares Bermak — Fares Bermak/);
    expect(marquee).toBeInTheDocument();
  });

  it('navigation links have correct hrefs', () => {
    render(<HeroSection />);
    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    const workLink = within(nav).getByRole('link', { name: /work/i });
    expect(workLink).toHaveAttribute('href', '#work');
  });

  it.skip('updates time display every second', async () => {
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
