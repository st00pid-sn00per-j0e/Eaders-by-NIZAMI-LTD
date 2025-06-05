import Image from 'next/image';

interface AdBannerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const AdBanner = ({ size = 'medium', className }: AdBannerProps) => {
  const dimensions = {
    small: { width: 300, height: 50 },
    medium: { width: 728, height: 90 },
    large: { width: 300, height: 250 },
  };
  const currentDimensions = dimensions[size];

  return (
    <div 
      className={`bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center my-6 ${className}`}
      style={{ 
        width: '100%', 
        maxWidth: `${currentDimensions.width}px`, 
        height: `${currentDimensions.height}px`, 
        margin: '24px auto' 
      }}
      aria-label="Advertisement Banner Placeholder"
    >
      <Image 
        src={`https://placehold.co/${currentDimensions.width}x${currentDimensions.height}.png?text=Ad+Banner`}
        alt="Advertisement Banner"
        width={currentDimensions.width}
        height={currentDimensions.height}
        className="object-contain"
        data-ai-hint="advertisement banner"
      />
    </div>
  );
};

export default AdBanner;
