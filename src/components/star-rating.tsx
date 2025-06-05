
"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  ratingCount?: number;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  className,
  showText = false,
  ratingCount,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (halfStar ? 1 : 0);

  const starSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={cn(starSizeClasses[size], 'fill-accent text-accent')} />
      ))}
      {halfStar && <Star key="half" className={cn(starSizeClasses[size], 'fill-accent text-accent')} style={{ clipPath: 'inset(0 50% 0 0)' }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={cn(starSizeClasses[size], 'text-muted-foreground/50')} />
      ))}
      {showText && (
        <span className={cn('ml-1 text-xs text-muted-foreground', size === 'lg' && 'text-sm')}>
          {rating.toFixed(1)}
          {ratingCount !== undefined && ` (${ratingCount})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
