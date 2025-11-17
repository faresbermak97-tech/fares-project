import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturesSection from '../FeaturesSection';

describe('FeaturesSection', () => {
  it('renders the section title', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Features/i)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Web Development/i)).toBeInTheDocument();
    expect(screen.getByText(/UI\/UX Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance/i)).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/Creating responsive web applications/i)).toBeInTheDocument();
    expect(screen.getByText(/Designing user interfaces/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimizing application performance/i)).toBeInTheDocument();
  });

  it('renders feature icons', () => {
    render(<FeaturesSection />);
    const icons = screen.getAllByRole('img');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('displays learn more buttons', () => {
    render(<FeaturesSection />);
    const buttons = screen.getAllByRole('button', { name: /Learn more/i });
    expect(buttons.length).toBeGreaterThan(0);
  });
});
