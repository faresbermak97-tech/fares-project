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
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority = false,
  style,
  objectPosition = 'center'
}: OptimizedImageProps) {
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
    />
  );
}
