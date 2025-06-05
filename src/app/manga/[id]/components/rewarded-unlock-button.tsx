
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Series } from '@/types'; // Changed from Manga to Series
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
  series: Series; // Changed from manga to series
}

export default function RewardedUnlockButton({ series }: RewardedUnlockButtonProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unlockedStatus = localStorage.getItem(`series-${series.id}-unlocked`); // Key by series.id
    if (unlockedStatus === 'true') {
      setIsUnlocked(true);
    }
  }, [series.id]);

  const handleUnlock = () => {
    setTimeout(() => {
      setIsUnlocked(true);
      localStorage.setItem(`series-${series.id}-unlocked`, 'true'); // Key by series.id
      toast({
        title: "Series Unlocked!",
        description: `You can now read all chapters of ${series.metadata.title}.`,
      });
      window.dispatchEvent(new Event('storage')); 
    }, 1500);
  };

  if (isUnlocked) {
    return (
      <Button variant="outline" disabled className="border-green-500 text-green-600">
        <Check className="mr-2 h-4 w-4" />
        Series Unlocked
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
          <AlertDialogTitle>Unlock {series.metadata.title}?</AlertDialogTitle>
          <AlertDialogDescription>
            Watch a short ad to unlock all chapters of this premium series. This helps support us and the creators!
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
