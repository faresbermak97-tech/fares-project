import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AboutSection from '../AboutSection';

describe('AboutSection', () => {
  it('renders the section title', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Who I Am/i)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<AboutSection />);
    expect(screen.getByText(/disciplined Remote Administrative Professional/i)).toBeInTheDocument();
  });

  it.skip('displays skills', () => {
    render(<AboutSection />);
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/i)).toBeInTheDocument();
  });

  it.skip('renders the download CV button', () => {
    render(<AboutSection />);
    const downloadButton = screen.getByRole('link', { name: /Download CV/i });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).toHaveAttribute('href');
  });

  it('renders the profile image', () => {
    render(<AboutSection />);
    const profileImage = screen.getByAltText(/Fares Bermak - Professional Profile/i);
    expect(profileImage).toBeInTheDocument();
  });
});
