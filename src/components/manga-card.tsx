
"use client";

import Link from 'next/link';
import Image from 'next/image';
import type { Series } from '@/types'; // Changed from Manga to Series
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenText } from 'lucide-react';
import StarRating from '@/components/star-rating';
import React, { useState, useEffect } from 'react';

interface MangaCardProps {
  series: Series; // Changed from manga to series
}

interface MangaRatings {
  [seriesId: string]: { // Changed from mangaId to seriesId
    totalScore: number;
    count: number;
    userRatings: { [userId: string]: number };
  };
}

const MangaCard = ({ series }: MangaCardProps) => {
  const [displayRating, setDisplayRating] = useState(series.averageRating || 0);
  const [displayRatingCount, setDisplayRatingCount] = useState(series.ratingCount || 0);

  useEffect(() => {
    const allRatingsData = localStorage.getItem('eaders-manga-ratings');
    if (allRatingsData) {
      try {
        const allRatings: MangaRatings = JSON.parse(allRatingsData);
        const seriesSpecificRatings = allRatings[series.id];
        if (seriesSpecificRatings && seriesSpecificRatings.count > 0) {
          setDisplayRating(seriesSpecificRatings.totalScore / seriesSpecificRatings.count);
          setDisplayRatingCount(seriesSpecificRatings.count);
        } else {
          // Reset to prop defaults if not found in localStorage or count is 0
          setDisplayRating(series.averageRating || 0);
          setDisplayRatingCount(series.ratingCount || 0);
        }
      } catch (e) {
        setDisplayRating(series.averageRating || 0);
        setDisplayRatingCount(series.ratingCount || 0);
      }
    } else {
        setDisplayRating(series.averageRating || 0);
        setDisplayRatingCount(series.ratingCount || 0);
    }
  }, [series.id, series.averageRating, series.ratingCount]);


  return (
    <Link href={`/manga/${series.id}`} passHref>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <CardHeader className="p-0 relative aspect-[2/3]">
          <Image
            src={series.coverImageUrl}
            alt={series.name} // Use series.name or series.metadata.title
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="manga cover"
          />
          {series.premium && (
            <Badge variant="destructive" className="absolute top-2 right-2 shadow-md">Premium</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-2">
          <CardTitle className="text-lg font-headline leading-tight mb-1 line-clamp-2">{series.metadata.title}</CardTitle>
          {series.metadata.authors && series.metadata.authors.length > 0 && (
            <p className="text-xs text-muted-foreground">By {series.metadata.authors.map(a => a.name).join(', ')}</p>
          )}
          
          {displayRating > 0 && (
            <StarRating rating={displayRating} ratingCount={displayRatingCount} size="sm" showText={true} />
          )}

          <p className="text-sm text-muted-foreground line-clamp-3">{series.metadata.summary}</p>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <BookOpenText className="w-4 h-4 mr-1.5" />
            <span>{series.booksCount} Chapters</span>
            {series.metadata.status && <span className="mx-1.5">&#8226;</span>}
            {series.metadata.status && <span className="capitalize">{series.metadata.status.toLowerCase()}</span>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MangaCard;
