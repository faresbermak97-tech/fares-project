import { render, screen, waitFor } from '@testing-library/react';
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

  it('disappears after completing all greetings', async () => {
    const { container } = render(<Preloader />);
    // Advance through all greetings (10 * 400ms = 4000ms)
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    // Wait for cleanup timeout (200ms)
    act(() => {
      jest.advanceTimersByTime(200);
    });
    // Run all timers
    act(() => {
      jest.runAllTimers();
    });
    // Wait for next tick
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
