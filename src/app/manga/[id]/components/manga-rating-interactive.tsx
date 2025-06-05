
"use client";

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StarRating from '@/components/star-rating'; // The display component
import type { Manga } from '@/types';

const MOCK_USER_ID = "currentUser"; // Simulate a logged-in user

interface MangaRatings {
  [mangaId: string]: {
    totalScore: number;
    count: number;
    userRatings: { [userId: string]: number };
  };
}

interface MangaRatingInteractiveProps {
  manga: Manga;
}

export default function MangaRatingInteractive({ manga }: MangaRatingInteractiveProps) {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(manga.averageRating || 0);
  const [ratingCount, setRatingCount] = useState<number>(manga.ratingCount || 0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    // Simulate checking auth status
    const storedAuth = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!storedAuth);

    // Load ratings from localStorage
    const allRatingsData = localStorage.getItem('eaders-manga-ratings');
    if (allRatingsData) {
      try {
        const allRatings: MangaRatings = JSON.parse(allRatingsData);
        const mangaSpecificRatings = allRatings[manga.id];
        if (mangaSpecificRatings) {
          setAverageRating(mangaSpecificRatings.totalScore / mangaSpecificRatings.count);
          setRatingCount(mangaSpecificRatings.count);
          if (storedAuth && mangaSpecificRatings.userRatings[MOCK_USER_ID]) {
            setCurrentUserRating(mangaSpecificRatings.userRatings[MOCK_USER_ID]);
          }
        }
      } catch (e) {
        console.error("Error loading manga ratings:", e);
      }
    }
  }, [manga.id, manga.averageRating, manga.ratingCount]);

  const handleRating = (newRating: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to rate manga.",
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

    let mangaSpecificRatings = allRatings[manga.id] || {
      totalScore: 0,
      count: 0,
      userRatings: {},
    };

    const oldUserRating = mangaSpecificRatings.userRatings[MOCK_USER_ID];

    if (oldUserRating !== undefined) { // User is changing their rating
      mangaSpecificRatings.totalScore = mangaSpecificRatings.totalScore - oldUserRating + newRating;
    } else { // New rating
      mangaSpecificRatings.totalScore += newRating;
      mangaSpecificRatings.count += 1;
    }
    mangaSpecificRatings.userRatings[MOCK_USER_ID] = newRating;
    
    allRatings[manga.id] = mangaSpecificRatings;
    localStorage.setItem('eaders-manga-ratings', JSON.stringify(allRatings));

    setAverageRating(mangaSpecificRatings.totalScore / mangaSpecificRatings.count);
    setRatingCount(mangaSpecificRatings.count);

    toast({
      title: "Rating Submitted!",
      description: `You rated ${manga.title} ${newRating} star(s).`,
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
            Sign in to rate this manga.
        </p>
      )}
    </div>
  );
}
