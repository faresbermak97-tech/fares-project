import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeaturesSection from '../FeaturesSection';

describe('FeaturesSection', () => {
  it('renders the section title', () => {
    render(<FeaturesSection />);
    // Check for the section element with id="features"
    expect(screen.getByRole('region', { name: /features/i })).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<FeaturesSection />);
    // Use getAllByText for terms that appear multiple times
    expect(screen.getAllByText(/Workflow Automation/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Organization/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Communication/i).length).toBeGreaterThan(0);
  });

  it('displays feature descriptions', () => {
    render(<FeaturesSection />);
    // Use more specific selectors for descriptions
    const paragraphs = screen.getAllByText(/I design smart automations that eliminate repetitive manual tasks/i);
    expect(paragraphs.length).toBeGreaterThan(0);
    
    const orgParagraphs = screen.getAllByText(/I bring structure to your digital workspace by creating clear systems/i);
    expect(orgParagraphs.length).toBeGreaterThan(0);
    
    const commParagraphs = screen.getAllByText(/Smooth communication is the backbone of any remote team/i);
    expect(commParagraphs.length).toBeGreaterThan(0);
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
