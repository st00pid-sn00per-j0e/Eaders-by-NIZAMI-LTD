
"use client";

import React, { useState, useEffect } from 'react';
import { mockMangaList } from '@/lib/mock-data';
import type { Manga } from '@/types';
import MangaCard from '@/components/manga-card';
import { Bookmark, BookmarkX, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import Link from 'next/link'; 

export default function BookmarksDisplay() {
  const [bookmarkedManga, setBookmarkedManga] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!authData);

    if (authData) {
      const bookmarksData = localStorage.getItem('eaders-bookmarks');
      if (bookmarksData) {
        try {
          const bookmarkIdsObject = JSON.parse(bookmarksData);
          const mangaIds = Object.keys(bookmarkIdsObject);
          
          const filteredManga = mockMangaList.filter(manga => mangaIds.includes(manga.id));
          setBookmarkedManga(filteredManga);
        } catch (error) {
          console.error("Error parsing bookmarks from localStorage:", error);
        }
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-10">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-10">
        <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-3xl font-headline font-bold mb-4 text-primary">Login Required</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
          Please sign in to view your bookmarked manga.
        </p>
        {/* Optional: Add a login button here if desired, though the main header has one. */}
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
            Here are all the manga series you've saved for later.
          </p>
        </div>
      </section>

      {bookmarkedManga.length > 0 ? (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {bookmarkedManga.map((manga: Manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20">
          <BookmarkX className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <p className="text-2xl font-headline font-semibold text-foreground mb-2">No Bookmarked Manga</p>
          <p className="text-md text-muted-foreground max-w-md mx-auto">
            You haven't bookmarked any manga yet. Start exploring and add your favorites to see them here!
          </p>
        </div>
      )}
    </div>
  );
}
