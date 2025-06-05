"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const InterstitialAdDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5); // 5 second countdown to close ad

  useEffect(() => {
    const shouldShowAd = sessionStorage.getItem('showInterstitialAd') === 'true';
    if (shouldShowAd) {
      setIsOpen(true);
      sessionStorage.removeItem('showInterstitialAd'); // Show only once per navigation
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isOpen && countdown === 0) {
      // Automatically close or enable close button - for now, enable close
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  const handleClose = () => {
    setIsOpen(false);
    setCountdown(5); // Reset countdown for next time
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md p-0" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-headline">Advertisement</DialogTitle>
          <DialogDescription>
            Please enjoy this short ad while your chapter loads.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {/* Placeholder for ad content */}
            <Image 
              src="https://placehold.co/400x225.png?text=Interstitial+Ad" 
              alt="Interstitial Ad" 
              width={400} 
              height={225} 
              className="object-cover"
              data-ai-hint="advertisement video"
            />
          </div>
        </div>
        <DialogFooter className="p-6 pt-0 flex justify-end">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={countdown > 0}
            className="relative"
          >
            {countdown > 0 ? `Close in ${countdown}s` : 'Close Ad'}
            {countdown === 0 && <X className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 md:hidden" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterstitialAdDialog;
