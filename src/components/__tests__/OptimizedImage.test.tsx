import { render, screen } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage', () => {
  it('renders an image with correct alt text', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        width={500}
        height={300}
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('applies the correct className', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        className="custom-class"
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toHaveClass('custom-class');
  });

  it('sets priority attribute when provided', () => {
    render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
        priority={true}
      />
    );

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });
});
