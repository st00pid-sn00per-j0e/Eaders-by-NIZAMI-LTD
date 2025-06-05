
"use client";

import Image from 'next/image';
import Link from 'next/link';
import InterstitialAdDialog from './interstitial-ad-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List, Maximize, Minimize } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import React, { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Manga, Chapter } from '@/types';

interface ChapterViewProps {
  manga: Manga;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  params: {
    id: string;
    chapterId: string;
  };
}

const AD_INTERVAL = 2; // Show an ad every 2 pages

export default function ChapterView({ manga, chapter, prevChapter, nextChapter, params }: ChapterViewProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);

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

  const pages = Array.from({ length: chapter.pageCount }, (_, i) => `https://placehold.co/800x1200.png?text=Page+${i + 1}`);

  return (
    <div className="mx-auto max-w-3xl">
      {!isFocusMode && <InterstitialAdDialog />}
      
      <div className={`sticky top-0 bg-background py-2 z-40 mb-4 border-b ${isFocusMode ? 'md:top-0' : 'md:top-0 top-16'}`}>
        <div className="container mx-auto px-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <h1 className="text-xl font-headline font-semibold truncate" title={manga.title}>{manga.title}</h1>
            <p className="text-sm text-muted-foreground truncate" title={chapter.title}>{chapter.title}</p>
          </div>
          <div className="flex gap-2 items-center">
            {!isFocusMode && (
              <>
                <Button variant="outline" size="sm" asChild title="Previous Chapter" disabled={!prevChapter}>
                  <Link href={prevChapter ? `/manga/${manga.id}/chapter/${prevChapter.id}` : '#'}>
                    <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline ml-1">Prev</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild title="Chapter List">
                  <Link href={`/manga/${manga.id}`}>
                    <List className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild title="Next Chapter" disabled={!nextChapter}>
                  <Link href={nextChapter ? `/manga/${manga.id}/chapter/${nextChapter.id}` : '#'}>
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
        {pages.map((pageUrl, index) => (
          <React.Fragment key={`page-wrapper-${index}`}>
            <div className="bg-card p-1 rounded-md shadow-sm">
              <Image
                src={pageUrl}
                alt={`Page ${index + 1} of ${chapter.title}`}
                width={800}
                height={1200}
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
            {prevChapter ? (
              <Button variant="outline" asChild>
                <Link href={`/manga/${manga.id}/chapter/${prevChapter.id}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
                </Link>
              </Button>
            ) : <div />}
            {nextChapter ? (
              <Button variant="default" asChild>
                <Link href={`/manga/${manga.id}/chapter/${nextChapter.id}`}>
                  Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href={`/manga/${manga.id}`}>
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
