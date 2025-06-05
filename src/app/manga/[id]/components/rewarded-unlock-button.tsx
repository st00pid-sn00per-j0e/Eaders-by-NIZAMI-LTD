"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Manga } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RewardedUnlockButtonProps {
  manga: Manga;
}

export default function RewardedUnlockButton({ manga }: RewardedUnlockButtonProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage if this manga was previously unlocked
    const unlockedStatus = localStorage.getItem(`manga-${manga.id}-unlocked`);
    if (unlockedStatus === 'true') {
      setIsUnlocked(true);
    }
  }, [manga.id]);

  const handleUnlock = () => {
    // Simulate watching a rewarded ad
    // In a real app, integrate with an ad SDK here
    setTimeout(() => {
      setIsUnlocked(true);
      localStorage.setItem(`manga-${manga.id}-unlocked`, 'true');
      toast({
        title: "Manga Unlocked!",
        description: `You can now read all chapters of ${manga.title}.`,
      });
      // Force a re-render or redirect if needed, or rely on state updating list items
      // This hack forces components relying on this localStorage item to re-check
      window.dispatchEvent(new Event('storage')); 
      // A more React-idiomatic way would be to use context or lift state.
      // For now, sibling components might need to listen to storage events or re-evaluate on navigation.
    }, 1500); // Simulate ad watching time
  };

  if (isUnlocked) {
    return (
      <Button variant="outline" disabled className="border-green-500 text-green-600">
        <Check className="mr-2 h-4 w-4" />
        Manga Unlocked
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Zap className="mr-2 h-4 w-4" />
          Unlock with Ad
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unlock {manga.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Watch a short ad to unlock all chapters of this premium manga. This helps support us and the creators!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnlock} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Watch Ad & Unlock
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
