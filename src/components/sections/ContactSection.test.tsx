import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ContactSection from './ContactSection';

// Mock fetch
global.fetch = jest.fn();

describe('ContactSection', () => {
  beforeEach(() => {
    // Reset fetch mock
    (fetch as jest.Mock).mockClear();

    // Mock document methods
    document.getElementById = jest.fn((id) => {
      if (id === 'contact-form') {
        return {
          classList: {
            remove: jest.fn(),
            add: jest.fn(),
          },
        };
      }
      return null;
    });

    // Mock body
    Object.defineProperty(document, 'body', {
      value: {
        style: {},
      },
      writable: true,
    });

    // Mock current time
    const mockDate = new Date('2023-01-01T12:00:00');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    jest.spyOn(mockDate, 'toLocaleTimeString').mockReturnValue('12:00:00');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders contact section correctly', () => {
    render(<ContactSection />);

    // Check main heading
    expect(screen.getByText('Let\'s work')).toBeInTheDocument();
    expect(screen.getByText('together')).toBeInTheDocument();

    // Check profile image
    expect(screen.getByAltText('Fares Bermak')).toBeInTheDocument();

    // Check contact links
    expect(screen.getByText('faresbermak97@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+213 542 346 579')).toBeInTheDocument();

    // Check social links
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
  });

  it('displays current time correctly', () => {
    render(<ContactSection />);

    // Check if time is displayed
    expect(screen.getByText('12:00:00 GMT+1')).toBeInTheDocument();
  });

  it('opens contact form when "Get in touch" button is clicked', () => {
    render(<ContactSection />);

    // Get the button
    const getInTouchButton = screen.getByText('Get in touch');

    // Click the button
    fireEvent.click(getInTouchButton);

    // Check if form was shown
    expect(document.getElementById).toHaveBeenCalledWith('contact-form');
    const mockForm = document.getElementById('contact-form');
    expect(mockForm?.classList.remove).toHaveBeenCalledWith('hidden');
    expect(mockForm?.classList.add).toHaveBeenCalledWith('flex');
  });

  it('handles form submission correctly', async () => {
    // Mock successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ message: 'Message sent successfully' }),
    });

    render(<ContactSection />);

    // Get form elements
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    // Fill form
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    // Submit form
    fireEvent.click(submitButton);

    // Check if fetch was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message',
        }),
      });
    });
  });

  it('displays success message on successful submission', async () => {
    // Mock successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ message: 'Message sent successfully' }),
    });

    render(<ContactSection />);

    // Get form elements and submit
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    // Check if success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully')).toBeInTheDocument();
    });
  });

  it('displays error message on failed submission', async () => {
    // Mock error response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => ({ error: 'Failed to send message' }),
    });

    render(<ContactSection />);

    // Get form elements and submit
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument();
    });
  });

  it('handles network error during form submission', async () => {
    // Mock network error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ContactSection />);

    // Get form elements and submit
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    // Mock response with delay
    (fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => ({ message: 'Message sent successfully' }),
      }), 100)
    );

    render(<ContactSection />);

    // Get form elements and submit
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');
    const submitButton = screen.getByText('Send Message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    // Check if loading state is shown
    expect(screen.getByText('Sending...')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully')).toBeInTheDocument();
    });
  });
});
