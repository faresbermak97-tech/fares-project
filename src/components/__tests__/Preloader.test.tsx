import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Preloader, { greetings } from '../Preloader';

// Mock timers
jest.useFakeTimers();

describe('Preloader', () => {
  it('displays the first greeting initially', () => {
    render(<Preloader />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('cycles through greetings', () => {
    render(<Preloader />);

    // Initial greeting
    expect(screen.getByText('Hello')).toBeInTheDocument();

    // Advance time to show next greeting
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('Bonjour')).toBeInTheDocument();

    // Continue advancing through greetings
    act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(screen.getByText('Ciao')).toBeInTheDocument();
  });

  it('disappears after completing all greetings', () => {
    const { container } = render(<Preloader />);

    // Advance through all greetings
    act(() => {
      jest.advanceTimersByTime(200 * greetings.length); // Move through all greetings
    });

    // Advance the final timeout
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Wait for the component to update
    act(() => {
      jest.runAllTimers();
    });

    // Component should return null (not in DOM)
    expect(container.firstChild).toBeNull();
  });
});
