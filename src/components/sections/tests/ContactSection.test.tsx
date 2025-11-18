import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContactSection from '../ContactSection';

interface MockedResponse extends Partial<Response> {
  json: () => Promise<any>;
  ok: boolean;
  status: number;
  headers: Headers;
  redirected: boolean;
  statusText: string;
  type: ResponseType;
  clone: () => Response;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
  blob: () => Promise<Blob>;
  formData: () => Promise<FormData>;
}

// Mock the global Response object
global.Response = jest.fn((body, init) => ({
  json: () => Promise.resolve(JSON.parse(body ? String(body) : '{}')),
  ok: init?.status ? (init.status >= 200 && init.status < 300) : true,
  status: init?.status || 200,
  headers: new Headers(init?.headers), // Add headers property
  // Add other missing properties/methods if needed by the test or TypeScript
  get redirected(): boolean { return false; },
  get statusText(): string { return String(this.status); },
  get type(): ResponseType { return 'default'; },
  clone(): Response { return new Response(body, { status: this.status, headers: this.headers }); },
  text(): Promise<string> { return Promise.resolve(body ? String(body) : ''); },
  arrayBuffer(): Promise<ArrayBuffer> { return Promise.resolve(new ArrayBuffer(0)); },
  blob(): Promise<Blob> { return Promise.resolve(new Blob()); },
  formData(): Promise<FormData> { return Promise.resolve(new FormData()); },
})) as jest.Mock<MockedResponse>;

// Add static methods to the mock
Object.assign(global.Response, {
  error: jest.fn(() => new Response(null, { status: 500 })),
  json: jest.fn((data, init) => new Response(JSON.stringify(data), init)),
  redirect: jest.fn((url, status) => new Response(null, { headers: { Location: url }, status })),
});

interface MockedHeaders extends Partial<Headers> {
  append: (name: string, value: string) => void;
  delete: (name: string) => void;
  get: (name: string) => string | null;
  has: (name: string) => boolean;
  set: (name: string, value: string) => void;
  [Symbol.iterator]: () => IterableIterator<[string, string]>;
}

// Mock global.Headers as well
global.Headers = jest.fn(function(init?: HeadersInit) {
  const headers = new Map<string, string>();
  if (init) {
    if (Array.isArray(init)) {
      init.forEach(([key, value]) => headers.set(key.toLowerCase(), value));
    } else if (init instanceof Headers) {
      init.forEach((value, key) => headers.set(key.toLowerCase(), value));
    } else {
      for (const key in init) {
        headers.set(key.toLowerCase(), init[key]);
      }
    }
  }
  return {
    append: (name: string, value: string) => headers.set(name.toLowerCase(), value),
    delete: (name: string) => headers.delete(name.toLowerCase()),
    get: (name: string) => headers.get(name.toLowerCase()),
    has: (name: string) => headers.has(name.toLowerCase()),
    set: (name: string, value: string) => headers.set(name.toLowerCase(), value),
    [Symbol.iterator]: () => headers[Symbol.iterator](),
  };
}) as jest.Mock<MockedHeaders>;

// Mock fetch
global.fetch = jest.fn();

// Helper function to create a mock Response
const mockResponse = (ok: boolean, data: Record<string, unknown>) => {
  return new Response(JSON.stringify(data), {
    status: ok ? 200 : 500,
    headers: { 'Content-Type': 'application/json' },
  });
};

describe('ContactSection', () => {
  beforeEach(() => {
    // Mock the global fetch function to simulate a successful API response
    global.fetch = jest.fn(() => Promise.resolve(mockResponse(true, { message: 'Success' })));
    // Ensure fetch is reset for other tests
    jest.clearAllMocks();
  });

  it('renders contact information', () => {
    render(<ContactSection />);
    expect(screen.getByText(/faresbermak97@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+213 542 346 579/i)).toBeInTheDocument();
  });

  it('opens contact form when button clicked', async () => {
    render(<ContactSection />);
    // Use getAllByRole and select the first button (desktop version)
    const button = screen.getAllByRole('button', { name: /get in touch/i })[0];

    fireEvent.click(button);

    await waitFor(() => {
      // Fix: Look for the heading, not role="dialog"
      expect(screen.getByRole('heading', { name: /Get in touch/i })).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    render(<ContactSection />);

    // Open form
    fireEvent.click(screen.getAllByRole('button', { name: /get in touch/i })[0]);

    // Try to submit without filling fields
    const submitButton = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockResponse(true, { success: true, message: 'Sent!' })
    );
    render(<ContactSection />);

    // Open form
    fireEvent.click(screen.getAllByRole('button', { name: /get in touch/i })[0]);

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
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockResponse(true, {
        success: true,
        message: 'Your message has been sent successfully!'
      })
    );
    render(<ContactSection />);

    // Open the modal using the fixed query
    fireEvent.click(screen.getAllByRole('button', { name: /get in touch/i })[0]);

    // Wait for the form to be fully rendered
    await waitFor(() => {
      // We will wait for the 'name' input to be available
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    // Now that the form is open, type the required fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Hello world');

    // Click the send button (this triggers the successful mock fetch)
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/Your message has been sent successfully!/i)).toBeInTheDocument();
    });
    // Also confirm the error message is gone
    expect(screen.queryByText(/An unexpected error occurred/i)).not.toBeInTheDocument();
  });

  it('displays error message on failure', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      mockResponse(false, { error: 'Failed to send' })
    );
    render(<ContactSection />);

    fireEvent.click(screen.getAllByRole('button', { name: /get in touch/i })[0]);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });
  });
});