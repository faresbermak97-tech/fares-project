import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailModal from '../DetailModal';

describe('DetailModal', () => {
  const mockProps = {
    title: 'Test Service',
    details: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
  };

  it('renders trigger button', () => {
    render(<DetailModal {...mockProps} />);
    expect(screen.getByRole('button', { name: /detail/i })).toBeInTheDocument();
  });

  it('opens modal when trigger button clicked', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays title in modal', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));

    expect(screen.getByText('Test Service')).toBeInTheDocument();
  });

  it('displays all detail items', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));

    mockProps.details.forEach(detail => {
      expect(screen.getByText(detail)).toBeInTheDocument();
    });
  });

  it('closes modal when close button clicked', () => {
    render(<DetailModal {...mockProps} />);

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: /detail/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when backdrop clicked', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));

    // Click backdrop (not the modal content)
    const backdrop = screen.getByRole('dialog').parentElement?.previousElementSibling;
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes modal when Escape key pressed', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps focus within modal when open', () => {
    render(<DetailModal {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: /detail/i }));

    const dialog = screen.getByRole('dialog');
    const closeButton = within(dialog).getByRole('button', { name: /close/i });

    // Focus should be within the modal
    expect(document.activeElement).toBe(closeButton);
  });
});
