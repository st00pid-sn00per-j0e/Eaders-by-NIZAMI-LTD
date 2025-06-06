
"use client";

import Image from 'next/image';
import Link from 'next/link';
import InterstitialAdDialog from './interstitial-ad-dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, List, Maximize, Minimize, Loader2, Palette, RotateCcw } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Series, Book, Page } from '@/types';
import { getBookPages } from '@/lib/manga-service';
import { colorizeMangaPanel, type ColorizeMangaPanelInput } from '@/ai/flows/colorize-manga-panel-flow';
import { useToast } from '@/hooks/use-toast';

interface ChapterViewProps {
  series: Series;
  book: Book;
  prevBook: Book | null;
  nextBook: Book | null;
}

const AD_INTERVAL = 2;
const USER_BALANCE_KEY = 'eaders-user-balance';
const COLORIZATION_COST = 1;

// Helper function to convert image URL to data URI
async function convertImageToDataUri(imageUrl: string): Promise<string> {
  try {
    const urlToFetch = !imageUrl.startsWith('data:') ? `/api/image-proxy?url=${encodeURIComponent(imageUrl)}` : imageUrl;
    const response = await fetch(urlToFetch);

    if (!response.ok) {
        if (urlToFetch.startsWith('/api/image-proxy')) {
            console.warn("Proxy fetch failed, attempting direct fetch for:", imageUrl);
            const directResponse = await fetch(imageUrl);
            if(!directResponse.ok) {
                throw new Error(`Direct fetch failed for ${imageUrl}: ${directResponse.statusText}`);
            }
            const blob = await directResponse.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(blob);
            });
        }
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to data URI:", error);
    throw new Error("Could not load image for colorization. Check CORS policy or image URL.");
  }
}


export default function ChapterView({ series, book, prevBook, nextBook }: ChapterViewProps) {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [colorizedPages, setColorizedPages] = useState<{ [pageNumber: number]: string | 'loading' }>({});
  const [userBalance, setUserBalance] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null); // User identifier
  const { toast } = useToast();

  useEffect(() => {
    const updateAuthStateAndBalance = () => {
      const authData = localStorage.getItem('eaders-auth');
      if (authData) {
        try {
          const parsedAuth = JSON.parse(authData);
          if (parsedAuth && parsedAuth.user && parsedAuth.user.email) {
            setIsLoggedIn(true);
            setCurrentUserId(parsedAuth.user.email);
          } else {
            setIsLoggedIn(false);
            setCurrentUserId(null);
          }
        } catch (error) {
          console.error("Error parsing auth data on load:", error);
          setIsLoggedIn(false);
          setCurrentUserId(null);
        }
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(null);
      }

      const storedBalance = localStorage.getItem(USER_BALANCE_KEY);
      setUserBalance(storedBalance ? parseFloat(storedBalance) : 0);
    };

    updateAuthStateAndBalance(); // Initial check

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === USER_BALANCE_KEY && event.newValue !== null) {
        setUserBalance(parseFloat(event.newValue));
      }
      if (event.key === 'eaders-auth') {
        if (event.newValue) {
          try {
            const authData = JSON.parse(event.newValue);
            if (authData && authData.user && authData.user.email) {
                setIsLoggedIn(true);
                setCurrentUserId(authData.user.email);
            } else {
                setIsLoggedIn(false);
                setCurrentUserId(null);
            }
          } catch (error) {
            console.error("Error parsing auth data on storage event:", error);
            setIsLoggedIn(false);
            setCurrentUserId(null);
          }
        } else { // Auth data removed (logout)
          setIsLoggedIn(false);
          setCurrentUserId(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const getLocalStorageKey = useCallback(() => {
    if (!currentUserId || !book.id) {
      return null;
    }
    return `eaders-colorized-pages-${currentUserId}-${book.id}`;
  }, [currentUserId, book.id]);

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
    async function fetchAndLoadPages() {
      setIsLoadingPages(true);
      setPages([]);
      
      const key = getLocalStorageKey();
      if (key) {
        const savedColorizations = localStorage.getItem(key);
        if (savedColorizations) {
          try {
            setColorizedPages(JSON.parse(savedColorizations));
          } catch (e) {
            console.error("Error parsing saved colorizations:", e);
            setColorizedPages({});
          }
        } else {
          setColorizedPages({});
        }
      } else {
         setColorizedPages({}); // Clear if no valid key (user logged out)
      }
      
      try {
        const fetchedPages = await getBookPages(book.id);
        setPages(fetchedPages);
      } catch (error) {
        console.error("Failed to fetch book pages:", error);
        // toast({ title: "Error", description: "Could not load chapter pages.", variant: "destructive" });
      } finally {
        setIsLoadingPages(false);
      }
    }
    if (book.id) {
        fetchAndLoadPages();
    }
  }, [book.id, getLocalStorageKey]); // getLocalStorageKey will change if currentUserId changes


  useEffect(() => {
    const key = getLocalStorageKey();
    if (key) { // Only save if there's a valid user-specific key
      // Save if there are colorizations, or if there was a previous entry for this user/book (to clear it if colorizedPages is now empty)
      if (Object.keys(colorizedPages).length > 0 || localStorage.getItem(key)) {
         try {
            localStorage.setItem(key, JSON.stringify(colorizedPages));
         } catch (e) {
            console.error("Error saving colorizations to localStorage:", e);
            toast({
                title: "Storage Error",
                description: "Could not save colorization progress. Your browser storage might be full.",
                variant: "destructive"
            });
         }
      }
    }
  }, [colorizedPages, getLocalStorageKey, toast]);


  const handleColorizePage = useCallback(async (page: Page) => {
    if (!isLoggedIn) {
      toast({ title: "Login Required", description: "Please sign in to use AI colorization.", variant: "destructive" });
      return;
    }

    if (userBalance < COLORIZATION_COST) {
      toast({
        title: "Insufficient Balance",
        description: `You need $${COLORIZATION_COST.toFixed(2)} to colorize this page. Please add credits.`,
        variant: "destructive",
      });
      return;
    }

    setColorizedPages(prev => ({ ...prev, [page.number]: 'loading' }));
    try {
      const originalPanelDataUri = await convertImageToDataUri(page.url);
      const input: ColorizeMangaPanelInput = { panelDataUri: originalPanelDataUri };
      const result = await colorizeMangaPanel(input);
      
      const newBalance = userBalance - COLORIZATION_COST;
      localStorage.setItem(USER_BALANCE_KEY, newBalance.toString());
      setUserBalance(newBalance);
      window.dispatchEvent(new StorageEvent('storage', { key: USER_BALANCE_KEY, newValue: newBalance.toString() }));

      setColorizedPages(prev => ({ ...prev, [page.number]: result.colorizedPanelDataUri }));
      toast({ title: "Panel Colorized!", description: `Page ${page.number} has been colorized. $${COLORIZATION_COST.toFixed(2)} deducted.` });
    } catch (error: any) {
      console.error("Error colorizing page:", error);
      setColorizedPages(prev => {
        const newState = { ...prev };
        if (newState[page.number] === 'loading') {
          delete newState[page.number];
        }
        return newState;
      }); 
      toast({
        title: "Colorization Failed",
        description: error.message || "Could not colorize the panel. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, userBalance, isLoggedIn]);

  const handleRevertToOriginal = (pageNumber: number) => {
    setColorizedPages(prev => {
      const newState = { ...prev };
      delete newState[pageNumber]; 
      // The useEffect watching colorizedPages will handle updating localStorage.
      return newState;
    });
     toast({ title: "Reverted", description: `Page ${pageNumber} reverted to original.`});
  };


  if (isLoadingPages) {
    return (
      <div className="mx-auto max-w-3xl text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading chapter pages...</p>
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
        {pages.map((page, index) => {
          const currentImageSrc = typeof colorizedPages[page.number] === 'string' && colorizedPages[page.number] !== 'loading'
            ? colorizedPages[page.number] as string
            : page.url;
          const isColorizingThisPage = colorizedPages[page.number] === 'loading';
          const isPageColorized = typeof colorizedPages[page.number] === 'string' && colorizedPages[page.number] !== 'loading' && colorizedPages[page.number] !== page.url;

          return (
            <React.Fragment key={`page-wrapper-${page.number}`}>
              <div 
                className="bg-card p-1 rounded-md shadow-sm relative group"
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src={currentImageSrc}
                  alt={`Page ${page.number} of ${book.name || `Chapter ${book.number}`}`}
                  width={page.width || 800}
                  height={page.height || 1200}
                  className="w-full h-auto rounded"
                  priority={index < 3} 
                  data-ai-hint="manga page"
                  unoptimized={currentImageSrc.startsWith('data:')} 
                />
                {isLoggedIn && !isFocusMode && (
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    {isPageColorized ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="bg-background/80 hover:bg-background"
                              onClick={() => handleRevertToOriginal(page.number)}
                            >
                              <RotateCcw className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Revert to Original</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="bg-background/80 hover:bg-background"
                              onClick={() => handleColorizePage(page)}
                              disabled={isColorizingThisPage || !isLoggedIn}
                            >
                              {isColorizingThisPage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Palette className="h-5 w-5 text-accent" />}
                            </Button>
                          </TooltipTrigger>
                           <TooltipContent><p>Colorize with AI ($1.00)</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
                 {isColorizingThisPage && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                    </div>
                )}
              </div>
              {!isFocusMode && (index + 1) % AD_INTERVAL === 0 && (index + 1) < pages.length && (
                 <AdBanner key={`ad-${index}`} size="small" className="my-4" />
              )}
            </React.Fragment>
          )
        })}
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

