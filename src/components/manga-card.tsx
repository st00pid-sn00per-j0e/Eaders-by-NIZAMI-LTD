
"use client"; // MangaCard needs to be client for potential localStorage access for ratings

import Link from 'next/link';
import Image from 'next/image';
import type { Manga } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenText, Star } from 'lucide-react';
import StarRating from '@/components/star-rating'; // Import StarRating
import React, { useState, useEffect } from 'react';

interface MangaCardProps {
  manga: Manga;
}

interface MangaRatings {
  [mangaId: string]: {
    totalScore: number;
    count: number;
    userRatings: { [userId: string]: number };
  };
}

const MangaCard = ({ manga }: MangaCardProps) => {
  const [displayRating, setDisplayRating] = useState(manga.averageRating || 0);
  const [displayRatingCount, setDisplayRatingCount] = useState(manga.ratingCount || 0);

  useEffect(() => {
    const allRatingsData = localStorage.getItem('eaders-manga-ratings');
    if (allRatingsData) {
      try {
        const allRatings: MangaRatings = JSON.parse(allRatingsData);
        const mangaSpecificRatings = allRatings[manga.id];
        if (mangaSpecificRatings && mangaSpecificRatings.count > 0) {
          setDisplayRating(mangaSpecificRatings.totalScore / mangaSpecificRatings.count);
          setDisplayRatingCount(mangaSpecificRatings.count);
        }
      } catch (e) {
        // Keep default if error
      }
    }
  }, [manga.id, manga.averageRating, manga.ratingCount]);


  return (
    <Link href={`/manga/${manga.id}`} passHref>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 rounded-lg">
        <CardHeader className="p-0 relative aspect-[2/3]">
          <Image
            src={manga.coverImageUrl}
            alt={manga.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
            data-ai-hint="manga cover"
          />
          {manga.premium && (
            <Badge variant="destructive" className="absolute top-2 right-2 shadow-md">Premium</Badge>
          )}
        </CardHeader>
        <CardContent className="p-4 flex-grow space-y-2">
          <CardTitle className="text-lg font-headline leading-tight mb-1 line-clamp-2">{manga.title}</CardTitle>
          {manga.author && <p className="text-xs text-muted-foreground">By {manga.author}</p>}
          
          {displayRating > 0 && (
            <StarRating rating={displayRating} ratingCount={displayRatingCount} size="sm" showText={true} />
          )}

          <p className="text-sm text-muted-foreground line-clamp-3">{manga.description}</p>
        </CardContent>
        <CardFooter className="p-4 border-t">
          <div className="flex items-center text-xs text-muted-foreground">
            <BookOpenText className="w-4 h-4 mr-1.5" />
            <span>{manga.chapters.length} Chapters</span>
            {manga.status && <span className="mx-1.5">&#8226;</span>}
            {manga.status && <span>{manga.status}</span>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MangaCard;
