import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactSection from '../ContactSection';

// Mock fetch
global.fetch = jest.fn();

describe('ContactSection', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders contact information', () => {
    render(<ContactSection />);
    expect(screen.getByText(/faresbermak97@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+213 542 346 579/i)).toBeInTheDocument();
  });

  it('opens contact form when button clicked', async () => {
    render(<ContactSection />);
    const button = screen.getByRole('button', { name: /get in touch/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<ContactSection />);

    // Open form
    fireEvent.click(screen.getByRole('button', { name: /get in touch/i }));

    // Try to submit without filling fields
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Sent!' }),
    });
    render(<ContactSection />);

    // Open form
    fireEvent.click(screen.getByRole('button', { name: /get in touch/i }));

    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      });
    });
  });

  it('displays success message after submission', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        message: 'Your message has been sent successfully!' 
      }),
    });
    render(<ContactSection />);

    fireEvent.click(screen.getByRole('button', { name: /get in touch/i }));

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/sent successfully/i)).toBeInTheDocument();
    });
  });

  it('displays error message on failure', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to send' }),
    });
    render(<ContactSection />);

    fireEvent.click(screen.getByRole('button', { name: /get in touch/i }));

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
  });
});
