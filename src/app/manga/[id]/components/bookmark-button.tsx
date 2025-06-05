
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  mangaId: string;
}

export default function BookmarkButton({ mangaId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check auth status
    const authData = localStorage.getItem('eaders-auth');
    setIsLoggedIn(!!authData);

    // Check local storage for bookmark status if logged in
    if (authData) {
      const bookmarks = JSON.parse(localStorage.getItem('eaders-bookmarks') || '{}');
      if (bookmarks[mangaId]) {
        setIsBookmarked(true);
      }
    }
  }, [mangaId]);

  const toggleBookmark = () => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please sign in to bookmark manga.",
        variant: "destructive",
      });
      return;
    }

    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);

    const bookmarks = JSON.parse(localStorage.getItem('eaders-bookmarks') || '{}');
    if (newBookmarkStatus) {
      bookmarks[mangaId] = true;
      toast({ title: "Bookmarked!", description: "This manga has been added to your bookmarks." });
    } else {
      delete bookmarks[mangaId];
      toast({ title: "Bookmark Removed", description: "This manga has been removed from your bookmarks." });
    }
    localStorage.setItem('eaders-bookmarks', JSON.stringify(bookmarks));
  };

  return (
    <Button onClick={toggleBookmark} variant="outline" size="lg">
      {isBookmarked && isLoggedIn ? ( // Only show checked if also logged in
        <BookmarkCheck className="mr-2 h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {isBookmarked && isLoggedIn ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}
