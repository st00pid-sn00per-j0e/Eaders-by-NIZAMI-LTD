
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  seriesId: string; // Changed from mangaId to seriesId
}

export default function BookmarkButton({ seriesId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const authData = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!authData);

    if (authData) {
      const bookmarks = JSON.parse(localStorage.getItem('eaders-bookmarks') || '{}');
      if (bookmarks[seriesId]) { // Use seriesId
        setIsBookmarked(true);
      }
    }
  }, [seriesId]);

  const toggleBookmark = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to bookmark series.",
        variant: "destructive",
      });
      return;
    }

    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);

    const bookmarks = JSON.parse(localStorage.getItem('eaders-bookmarks') || '{}');
    if (newBookmarkStatus) {
      bookmarks[seriesId] = true; // Use seriesId
      toast({ title: "Bookmarked!", description: "This series has been added to your bookmarks." });
    } else {
      delete bookmarks[seriesId]; // Use seriesId
      toast({ title: "Bookmark Removed", description: "This series has been removed from your bookmarks." });
    }
    localStorage.setItem('eaders-bookmarks', JSON.stringify(bookmarks));
  };

  return (
    <Button onClick={toggleBookmark} variant="outline" size="lg">
      {isBookmarked && isLoggedIn ? (
        <BookmarkCheck className="mr-2 h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {isBookmarked && isLoggedIn ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}
