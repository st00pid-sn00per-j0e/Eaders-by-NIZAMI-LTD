
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface FeedbackEntry {
  text: string;
  timestamp: string;
}

export default function FeedbackForm() {
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkLoginStatus = () => {
      const authData = localStorage.getItem('eaders-auth');
      setIsLoggedIn(!!authData);
    };

    checkLoginStatus(); // Initial check

    // Listen for storage changes to update login status
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'eaders-auth') {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        title: 'Empty Feedback',
        description: 'Please write your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const existingFeedbackString = localStorage.getItem('eaders-feedback');
      const existingFeedback: FeedbackEntry[] = existingFeedbackString ? JSON.parse(existingFeedbackString) : [];
      
      const newFeedbackEntry: FeedbackEntry = {
        text: feedbackText.trim(),
        timestamp: new Date().toISOString(),
      };

      existingFeedback.push(newFeedbackEntry);
      localStorage.setItem('eaders-feedback', JSON.stringify(existingFeedback));

      toast({
        title: 'Feedback Submitted!',
        description: "Thanks for helping us improve Eaders.",
      });
      setFeedbackText(''); // Clear textarea
    } catch (error) {
      console.error("Error saving feedback to localStorage:", error);
      toast({
        title: 'Submission Error',
        description: 'Could not save your feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isLoggedIn) {
    return null; // Don't render anything if user is not logged in
  }

  return (
    <Card className="mt-8 w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Share Your Feedback</CardTitle>
        <CardDescription>
          Let us know what features you'd like to see or any improvements we can make!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="feedback-textarea" className="sr-only">Your Feedback</Label>
            <Textarea
              id="feedback-textarea"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Type your suggestions or comments here..."
              rows={4}
              className="text-sm"
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
