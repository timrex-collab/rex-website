interface PictureProps {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  width?: number;
  height?: number;
  fetchpriority?: "high" | "low" | "auto";
  style?: React.CSSProperties;
  "data-testid"?: string;
}

export default function Picture({
  src,
  fallback,
  alt,
  className,
  loading,
  width,
  height,
  fetchpriority,
  style,
  "data-testid": testId,
}: PictureProps) {
  if (fallback) {
    return (
      <picture>
        <source srcSet={src} type="image/webp" />
        <img
          src={fallback}
          alt={alt}
          className={className}
          loading={loading}
          width={width}
          height={height}
          // @ts-ignore – fetchpriority is a valid HTML attribute, React support added in 18.3
          fetchpriority={fetchpriority}
          style={style}
          data-testid={testId}
        />
      </picture>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      // @ts-ignore – fetchpriority is a valid HTML attribute, React support added in 18.3
      fetchpriority={fetchpriority}
      style={style}
      data-testid={testId}
    />
  );
}
