"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Chapter } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface ChapterListItemProps {
  mangaId: string;
  chapter: Chapter;
  isLocked?: boolean; // Initially locked status
}

export default function ChapterListItem({ mangaId, chapter, isLocked: initialLockStatus = false }: ChapterListItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEffectivelyLocked, setIsEffectivelyLocked] = useState(initialLockStatus);

  useEffect(() => {
    if (initialLockStatus) {
      const unlockedStatus = localStorage.getItem(`manga-${mangaId}-unlocked`);
      if (unlockedStatus === 'true') {
        setIsEffectivelyLocked(false);
      } else {
        setIsEffectivelyLocked(true);
      }
    } else {
      setIsEffectivelyLocked(false);
    }
  }, [initialLockStatus, mangaId]);
  
  const handleChapterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isEffectivelyLocked) {
      e.preventDefault();
      toast({
        title: "Chapter Locked",
        description: "Unlock this premium manga to read its chapters.",
        variant: "destructive",
      });
    } else {
      // Store that a chapter is being opened to trigger interstitial ad on chapter page
      sessionStorage.setItem('showInterstitialAd', 'true');
      // Navigation will proceed as normal via Link href
    }
  };

  return (
    <li className="group">
      <Link 
        href={isEffectivelyLocked ? '#' : `/manga/${mangaId}/chapter/${chapter.id}`} 
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
            <p className="font-medium text-foreground group-hover:text-primary transition-colors">{chapter.title}</p>
            <p className="text-sm text-muted-foreground">Chapter {chapter.chapterNumber} &bull; {chapter.pageCount} pages</p>
          </div>
        </div>
        {!isEffectivelyLocked && <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />}
      </Link>
    </li>
  );
}
