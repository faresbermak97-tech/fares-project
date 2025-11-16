import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CardsSection from './CardsSection';
import CardDetailModal from '@/components/modals/CardDetailModal';

// Mock ScrollTrigger and GSAP
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn().mockReturnValue([]),
    refresh: jest.fn(),
  },
}));

jest.mock('gsap', () => ({
  to: jest.fn(),
  set: jest.fn(),
  killTweensOf: jest.fn(),
  globalTimeline: {
    clear: jest.fn(),
  },
}));

describe('CardsSection', () => {
  beforeEach(() => {
    // Mock window scroll position
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    });

    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      height: 2000,
      width: 1000,
    }));
  });

  it('renders cards correctly', () => {
    render(<CardsSection />);

    // Check if all three cards are rendered
    expect(screen.getByText('Virtual Assistant & Admin Support')).toBeInTheDocument();
    expect(screen.getByText('Data Entry & Management')).toBeInTheDocument();
    expect(screen.getByText('IT Support Help Desk L1')).toBeInTheDocument();

    // Check if card numbers are rendered
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('applies correct card classes based on scroll position', () => {
    render(<CardsSection />);

    // Get first card element
    const firstCard = screen.getByText('Virtual Assistant & Admin Support').closest('.card');

    // Initially should have card-1 and progress-0 class
    expect(firstCard).toHaveClass('card-1', 'card-1-progress-0');
  });

  it('handles scroll events correctly', () => {
    render(<CardsSection />);

    // Simulate scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Should update scroll progress
    // Note: This is a simplified test - in a real scenario you'd need more complex mocking
  });

  it('renders DetailModal for each card', () => {
    render(<CardsSection />);

    // Check if DetailModal components are rendered
    const detailButtons = screen.getAllByText('Detail');
    expect(detailButtons).toHaveLength(3);
  });

  it('displays correct card data', () => {
    render(<CardsSection />);

    // Check first card content
    expect(screen.getByText(/Complete day-to-day operational support/)).toBeInTheDocument();
    expect(screen.getByText(/calendar management, inbox organization/)).toBeInTheDocument();

    // Check second card content
    expect(screen.getByText(/Fast, accurate data capture/)).toBeInTheDocument();
    expect(screen.getByText(/200-400\+ records monthly/)).toBeInTheDocument();

    // Check third card content
    expect(screen.getByText(/help remote teams integrate/)).toBeInTheDocument();
    expect(screen.getByText(/manage cloud systems/)).toBeInTheDocument();
  });

  it('applies correct background colors', () => {
    render(<CardsSection />);

    // Get card elements
    const cards = document.querySelectorAll('.card');

    // Check if cards have correct background colors
    expect(cards[0]).toHaveClass('bg-pink-300');
    expect(cards[1]).toHaveClass('bg-blue-300');
    expect(cards[2]).toHaveClass('bg-purple-300');
  });

  it('renders optimized images', () => {
    render(<CardsSection />);

    // Check if images are rendered with correct attributes
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    // Check first image
    expect(images[0]).toHaveAttribute('src', '/Remote Virtual Assistance.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Virtual Assistant & Admin Support');
  });
});
