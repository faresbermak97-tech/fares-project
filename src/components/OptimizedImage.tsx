import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
  objectPosition?: string;
  placeholder?: 'blur' | 'empty';
}

// Generate a blur data URL using browser-safe btoa instead of Node.js Buffer
const generateBlurDataURL = (width: number, height: number) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<rect width="100%" height="100%" fill="#f3f4f6"/>
</svg>`;

  // Use browser-safe btoa instead of Buffer
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  style,
  objectPosition = 'center',
  placeholder = 'blur'
}: OptimizedImageProps) {
  const blurDataURL = width && height ? generateBlurDataURL(width, height) : undefined;

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1000}
      height={height || 1000}
      className={className}
      priority={priority}
      style={style}
      objectPosition={objectPosition}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
    />
  );
}