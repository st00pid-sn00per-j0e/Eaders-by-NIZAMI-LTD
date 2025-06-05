
"use client";

import Image from 'next/image';
import Link from 'next/link';
import InterstitialAdDialog from './interstitial-ad-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List, Maximize, Minimize } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Series, Book, Page } from '@/types'; // Import new types
import { getBookPages } from '@/lib/manga-service'; // Import service to get pages

interface ChapterViewProps {
  series: Series;
  book: Book;
  prevBook: Book | null;
  nextBook: Book | null;
}

const AD_INTERVAL = 2;

export default function ChapterView({ series, book, prevBook, nextBook }: ChapterViewProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }
    return () => {
      document.body.classList.remove('focus-mode-active');
    };
  }, [isFocusMode]);

  useEffect(() => {
    async function fetchPages() {
      setIsLoadingPages(true);
      const fetchedPages = await getBookPages(book.id);
      setPages(fetchedPages);
      setIsLoadingPages(false);
    }
    fetchPages();
  }, [book.id]);

  if (isLoadingPages) {
    return (
      <div className="mx-auto max-w-3xl text-center py-10">
        <p>Loading chapter pages...</p>
        {/* Optionally add a spinner here */}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {!isFocusMode && <InterstitialAdDialog />}
      
      <div className={`sticky bg-background py-2 z-40 mb-4 border-b ${isFocusMode ? 'top-0' : 'top-16'}`}>
        <div className="container mx-auto px-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <h1 className="text-xl font-headline font-semibold truncate" title={series.metadata.title}>{series.metadata.title}</h1>
            <p className="text-sm text-muted-foreground truncate" title={book.name || `Chapter ${book.number}`}>{book.name || `Chapter ${book.number}`}</p>
          </div>
          <div className="flex gap-2 items-center">
            {!isFocusMode && (
              <>
                <Button variant="outline" size="sm" asChild title="Previous Chapter" disabled={!prevBook}>
                  <Link href={prevBook ? `/manga/${series.id}/chapter/${prevBook.id}` : '#'}>
                    <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Prev</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild title="Chapter List">
                  <Link href={`/manga/${series.id}`}>
                    <List className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild title="Next Chapter" disabled={!nextBook}>
                  <Link href={nextBook ? `/manga/${series.id}/chapter/${nextBook.id}` : '#'}>
                    <span className="hidden sm:inline mr-1">Next</span> <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setIsFocusMode(!isFocusMode)}>
                    {isFocusMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {pages.map((page, index) => (
          <React.Fragment key={`page-wrapper-${page.number}`}>
            <div className="bg-card p-1 rounded-md shadow-sm">
              <Image
                src={page.url} // Use page.url from fetched pages
                alt={`Page ${page.number} of ${book.name || `Chapter ${book.number}`}`}
                width={page.width || 800}
                height={page.height || 1200}
                className="w-full h-auto rounded"
                priority={index < 3} 
                data-ai-hint="manga page"
              />
            </div>
            {!isFocusMode && (index + 1) % AD_INTERVAL === 0 && (index + 1) < pages.length && (
               <AdBanner key={`ad-${index}`} size="small" className="my-4" />
            )}
          </React.Fragment>
        ))}
      </div>

      {!isFocusMode && (
        <>
          <div className="mt-8 py-4 border-t flex justify-between items-center">
            {prevBook ? (
              <Button variant="outline" asChild>
                <Link href={`/manga/${series.id}/chapter/${prevBook.id}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
                </Link>
              </Button>
            ) : <div />}
            {nextBook ? (
              <Button variant="default" asChild>
                <Link href={`/manga/${series.id}/chapter/${nextBook.id}`}>
                  Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/manga/${series.id}`}>
                  Back to Chapters <List className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <AdBanner size="medium" className="mt-8" />
        </>
      )}
    </div>
  );
}
