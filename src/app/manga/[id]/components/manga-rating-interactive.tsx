
"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StarRating from '@/components/star-rating';
import type { Series } from '@/types'; // Changed from Manga to Series

const MOCK_USER_ID = "currentUser";

interface MangaRatings {
  [seriesId: string]: { // Changed from mangaId to seriesId
    totalScore: number;
    count: number;
    userRatings: { [userId: string]: number };
  };
}

interface MangaRatingInteractiveProps {
  series: Series; // Changed from manga to series
}

export default function MangaRatingInteractive({ series }: MangaRatingInteractiveProps) {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(series.averageRating || 0);
  const [ratingCount, setRatingCount] = useState<number>(series.ratingCount || 0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!storedAuth);

    const allRatingsData = localStorage.getItem('eaders-manga-ratings');
    if (allRatingsData) {
      try {
        const allRatings: MangaRatings = JSON.parse(allRatingsData);
        const seriesSpecificRatings = allRatings[series.id];
        if (seriesSpecificRatings) {
          setAverageRating(seriesSpecificRatings.count > 0 ? seriesSpecificRatings.totalScore / seriesSpecificRatings.count : 0);
          setRatingCount(seriesSpecificRatings.count);
          if (storedAuth && seriesSpecificRatings.userRatings[MOCK_USER_ID]) {
            setCurrentUserRating(seriesSpecificRatings.userRatings[MOCK_USER_ID]);
          }
        } else {
           setAverageRating(series.averageRating || 0);
           setRatingCount(series.ratingCount || 0);
        }
      } catch (e) {
        console.error("Error loading manga ratings:", e);
         setAverageRating(series.averageRating || 0);
         setRatingCount(series.ratingCount || 0);
      }
    } else {
        setAverageRating(series.averageRating || 0);
        setRatingCount(series.ratingCount || 0);
    }
  }, [series.id, series.averageRating, series.ratingCount]);

  const handleRating = (newRating: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to rate series.",
        variant: "destructive",
      });
      return;
    }

    setCurrentUserRating(newRating);

    const allRatingsData = localStorage.getItem('eaders-manga-ratings');
    let allRatings: MangaRatings = {};
    if (allRatingsData) {
      try {
        allRatings = JSON.parse(allRatingsData);
      } catch (e) {
        console.error("Error parsing ratings from localStorage:", e);
        allRatings = {};
      }
    }

    let seriesSpecificRatings = allRatings[series.id] || {
      totalScore: 0,
      count: 0,
      userRatings: {},
    };

    const oldUserRating = seriesSpecificRatings.userRatings[MOCK_USER_ID];

    if (oldUserRating !== undefined) {
      seriesSpecificRatings.totalScore = seriesSpecificRatings.totalScore - oldUserRating + newRating;
    } else {
      seriesSpecificRatings.totalScore += newRating;
      seriesSpecificRatings.count += 1;
    }
    seriesSpecificRatings.userRatings[MOCK_USER_ID] = newRating;
    
    allRatings[series.id] = seriesSpecificRatings;
    localStorage.setItem('eaders-manga-ratings', JSON.stringify(allRatings));

    setAverageRating(seriesSpecificRatings.totalScore / seriesSpecificRatings.count);
    setRatingCount(seriesSpecificRatings.count);

    toast({
      title: "Rating Submitted!",
      description: `You rated ${series.metadata.title} ${newRating} star(s).`,
    });
  };

  return (
    <div className="space-y-3 py-4">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-lg">Rating:</p>
        <StarRating rating={averageRating} ratingCount={ratingCount} size="lg" showText={true} />
      </div>

      {isLoggedIn && (
        <div className="pt-2">
          <p className="text-sm font-medium mb-1 text-muted-foreground">Your Rating:</p>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="icon"
                className="p-1 h-8 w-8 hover:bg-accent/20"
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                aria-label={`Rate ${star} star`}
              >
                <Star
                  className={`h-6 w-6 transition-colors
                    ${(hoverRating !== null && star <= hoverRating) || (hoverRating === null && currentUserRating !== null && star <= currentUserRating)
                      ? 'text-accent fill-accent'
                      : 'text-muted-foreground/50'
                    }`}
                />
              </Button>
            ))}
          </div>
          {currentUserRating && (
            <p className="text-xs text-muted-foreground mt-1">You rated this {currentUserRating} star(s).</p>
          )}
        </div>
      )}
      {!isLoggedIn && (
         <p className="text-sm text-muted-foreground">
            Sign in to rate this series.
        </p>
      )}
    </div>
  );
}
