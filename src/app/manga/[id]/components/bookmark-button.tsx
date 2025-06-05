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
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for bookmark status
    const bookmarks = JSON.parse(localStorage.getItem('eaders-bookmarks') || '{}');
    if (bookmarks[mangaId]) {
      setIsBookmarked(true);
    }
  }, [mangaId]);

  const toggleBookmark = () => {
    // Simulate API call and update local state + storage
    // In a real app, this would interact with a backend service and user auth
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
      {isBookmarked ? (
        <BookmarkCheck className="mr-2 h-5 w-5 text-primary" />
      ) : (
        <Bookmark className="mr-2 h-5 w-5" />
      )}
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}
