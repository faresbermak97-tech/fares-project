import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactSection from '../ContactSection';

// Mock fetch
global.fetch = jest.fn();

const mockResponse = (ok: boolean, data: any, status: number) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});

describe('ContactSection', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders contact information', () => {
    render(<ContactSection />);
    expect(screen.getByText(/faresbermak97@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+213 542 346 579/i)).toBeInTheDocument();
  });

  it('opens contact form when button is clicked', async () => {
    render(<ContactSection />);
    const button = screen.queryAllByRole('button', { name: /get in touch/i })[0];
    if (button) {
      fireEvent.click(button);
    }

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<ContactSection />);
    const button = screen.queryAllByRole('button', { name: /get in touch/i })[0];
    if (button) {
      fireEvent.click(button);
    }

    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission, so fetch is not called.
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse(true, { message: 'Sent!' }, 200));
    const user = userEvent.setup();
    render(<ContactSection />);

    const openButton = screen.queryAllByRole('button', { name: /get in touch/i })[0];
    if (openButton) {
        fireEvent.click(openButton);
    }
    
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

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
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse(true, { message: 'Your message has been sent successfully!' }, 200));
    const user = userEvent.setup();
    render(<ContactSection />);

    const openButton = screen.queryAllByRole('button', { name: /get in touch/i })[0];
    if (openButton) {
        fireEvent.click(openButton);
    }

    await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello world');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Your message has been sent successfully!/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse(false, { error: 'Failed to send' }, 500));
    const user = userEvent.setup();
    render(<ContactSection />);

    const openButton = screen.queryAllByRole('button', { name: /get in touch/i })[0];
    if (openButton) {
        fireEvent.click(openButton);
    }

    await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });
});