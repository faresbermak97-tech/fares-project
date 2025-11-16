import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DetailModal from './DetailModal';

// Mock setTimeout for animations
jest.useFakeTimers();

describe('DetailModal', () => {
  const mockTitle = 'Test Title';
  const mockDetails = ['Detail 1', 'Detail 2', 'Detail 3'];
  const mockImageSrc = '/test-image.jpg';

  beforeEach(() => {
    // Clear all timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  it('renders correctly with title and details', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Check if button is rendered
    expect(screen.getByText('Detail')).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    const customAriaLabel = 'Custom aria label';
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
        ariaLabel={customAriaLabel}
      />
    );

    // Check if button has custom aria-label
    expect(screen.getByText('Detail')).toHaveAttribute('aria-label', customAriaLabel);
  });

  it('opens modal when button is clicked', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Get button and click
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Modal should not be visible immediately
    expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Content should be visible after animation
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it('displays all details correctly', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check if all details are displayed
    mockDetails.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Get close button and click
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    // Fast-forward time for closing animation
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Modal should be closed
    expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
  });

  it('closes modal when backdrop is clicked', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Get backdrop and click
    const backdrop = screen.getByLabelText('Close modal');
    fireEvent.click(backdrop);

    // Fast-forward time for closing animation
    act(() => {
      jest.advanceTimersByTime(400);
    });

    // Modal should be closed
    expect(screen.queryByText(mockTitle)).not.toBeInTheDocument();
  });

  it('renders with image when imageSrc is provided', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
        imageSrc={mockImageSrc}
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check if image background is rendered
    const modalBackground = document.querySelector('.modal-background-image');
    expect(modalBackground).toHaveStyle({
      'background-image': `url(${mockImageSrc})`,
    });
  });

  it('renders without image when imageSrc is not provided', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check if image background is not rendered
    const modalBackground = document.querySelector('.modal-background-image');
    expect(modalBackground).not.toHaveStyle({
      'background-image': expect.any(String),
    });
  });

  it('animates details in sequence', () => {
    render(
      <DetailModal 
        title={mockTitle} 
        details={mockDetails} 
      />
    );

    // Open modal
    const detailButton = screen.getByText('Detail');
    fireEvent.click(detailButton);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Get all detail items
    const detailItems = screen.getAllByRole('listitem');

    // Check if all items are visible
    detailItems.forEach(item => {
      expect(item).toHaveClass('opacity-100', 'translate-x-0');
    });
  });
});
