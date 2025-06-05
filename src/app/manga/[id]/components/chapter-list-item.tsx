
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Book } from '@/types'; // Changed from Chapter to Book
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface ChapterListItemProps {
  seriesId: string; // Added seriesId
  book: Book; // Changed from chapter to book
  isLocked?: boolean;
}

export default function ChapterListItem({ seriesId, book, isLocked: initialLockStatus = false }: ChapterListItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEffectivelyLocked, setIsEffectivelyLocked] = useState(initialLockStatus);

  useEffect(() => {
    if (initialLockStatus) {
      // Komga premium/unlock status might be per series. Key for localStorage uses seriesId.
      const unlockedStatus = localStorage.getItem(`series-${seriesId}-unlocked`);
      if (unlockedStatus === 'true') {
        setIsEffectivelyLocked(false);
      } else {
        setIsEffectivelyLocked(true);
      }
    } else {
      setIsEffectivelyLocked(false);
    }
  }, [initialLockStatus, seriesId]);
  
  const handleChapterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEffectivelyLocked) {
      e.preventDefault();
      toast({
        title: "Chapter Locked",
        description: "Unlock this premium series to read its chapters.",
        variant: "destructive",
      });
    } else {
      sessionStorage.setItem('showInterstitialAd', 'true');
    }
  };

  return (
    <li className="group">
      <Link 
        href={isEffectivelyLocked ? '#' : `/manga/${seriesId}/chapter/${book.id}`} // Use seriesId and book.id
        onClick={handleChapterClick}
        className={`flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${isEffectivelyLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
        aria-disabled={isEffectivelyLocked}
      >
        <div className="flex items-center">
          {isEffectivelyLocked ? (
            <Lock className="h-5 w-5 text-destructive mr-3" />
          ) : (
            <BookOpen className="h-5 w-5 text-primary mr-3" />
          )}
          <div>
            {/* Use book.name or book.metadata.title */}
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">{book.name || `Chapter ${book.number}`}</p>
            <p className="text-sm text-muted-foreground">Chapter {book.number} &bull; {book.pagesCount} pages</p>
          </div>
        </div>
        {!isEffectivelyLocked && <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />}
      </Link>
    </li>
  );
}
