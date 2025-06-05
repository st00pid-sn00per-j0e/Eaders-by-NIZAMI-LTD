
"use client";

import React, { useState, useEffect } from 'react';
import { getSeriesById } from '@/lib/manga-service'; // Use new service
import type { Series } from '@/types'; // Use Series type
import MangaCard from '@/components/manga-card'; // Adapts to Series
import MangaCardSkeleton from '@/components/manga-card-skeleton';
import { Bookmark, BookmarkX, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function BookmarksDisplay() {
  const [bookmarkedSeries, setBookmarkedSeries] = useState<Series[]>([]); // Changed to Series[]
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!authData);

    async function loadBookmarks() {
      if (authData) {
        const bookmarksData = localStorage.getItem('eaders-bookmarks');
        if (bookmarksData) {
          try {
            const bookmarkIdsObject = JSON.parse(bookmarksData);
            const seriesIds = Object.keys(bookmarkIdsObject);

            // Fetch each bookmarked series individually using the service
            const fetchedSeriesPromises = seriesIds.map(id => getSeriesById(id));
            const results = await Promise.all(fetchedSeriesPromises);
            const validSeries = results.filter(s => s !== undefined) as Series[];
            setBookmarkedSeries(validSeries);
          } catch (error) {
            console.error("Error parsing bookmarks or fetching series:", error);
          }
        }
      }
      setIsLoading(false);
    }

    loadBookmarks();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <section className="pt-8 pb-4 bg-card rounded-lg shadow-sm">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Bookmark className="h-8 w-8 md:h-10 md:w-10 text-primary mr-2 md:mr-3 shrink-0" />
              <Skeleton className="h-8 w-48 md:h-10 md:w-64 rounded" />
            </div>
            <Skeleton className="h-5 w-3/4 max-w-xl mx-auto rounded" />
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <MangaCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-10">
        <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Login Required</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
          Please sign in to view your bookmarked series.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="pt-8 pb-4 bg-card rounded-lg shadow-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Bookmark className="h-8 w-8 md:h-10 md:w-10 text-primary mr-2 md:mr-3 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">
              My Bookmarks
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here are all the series you've saved for later.
          </p>
        </div>
      </section>

      {bookmarkedSeries.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {bookmarkedSeries.map((series: Series) => (
              <MangaCard key={series.id} series={series} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20">
          <BookmarkX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <p className="text-2xl font-headline font-semibold text-foreground mb-2">No Bookmarked Series</p>
          <p className="text-md text-muted-foreground max-w-md mx-auto">
            You haven't bookmarked any series yet. Start exploring and add your favorites!
          </p>
        </div>
      )}
    </div>
  );
}
