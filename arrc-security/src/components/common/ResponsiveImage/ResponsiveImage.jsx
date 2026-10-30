import './ResponsiveImage.css';

export default function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 48vw, 640px',
  ...props
}) {
  const isPhoto =
    typeof src === 'string' && src.startsWith('/assets/images/') && src.endsWith('.jpg');
  const base = isPhoto ? src.slice(0, -4) : null;
  const widths = {
    'team.jpg': 800,
    'warehouse.jpg': 900,
    'workplace.jpg': 1200,
    'residential.jpg': 1000,
  };
  const originalWidth = isPhoto ? widths[src.split('/').pop()] || 1600 : null;
  const sources = isPhoto
    ? [640, 960]
        .filter((width) => width < originalWidth)
        .map((width) => `${base}-${width}.jpg ${width}w`)
        .concat(`${src} ${originalWidth}w`)
        .join(', ')
    : undefined;
  return (
    <img src={src} alt={alt} srcSet={sources} sizes={isPhoto ? sizes : undefined} {...props} />
  );
}
