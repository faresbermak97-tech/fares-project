import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  quality?: number;
  placeholder?: 'blur' | 'empty' | undefined;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  style,
  quality = 75,
  placeholder = "blur"
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);
  
  // Generate a simple blur placeholder for images
  const generateBlurDataURL = (width: number, height: number) => {
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
      </svg>`
    ).toString('base64')}`;
  };

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width || 1000}
        height={height || 1000}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className || ''}`}
        priority={priority}
        style={style}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={generateBlurDataURL(width || 1000, height || 1000)}
        onLoad={() => setLoading(false)}
        loading={priority ? undefined : "lazy"}
      />
    </div>
  );
}
