
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, Bookmark } from 'lucide-react'; // Replaced UserCircle with Bookmark
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const AuthButtonClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Mock user data, in a real app this would come from an auth provider
  const [user, setUser] = useState<{ name: string; email: string; imageUrl?: string } | null>(null);
  const { toast } = useToast();

  // Simulate checking auth status on mount
  useEffect(() => {
    // Replace with actual auth check
    const storedAuth = localStorage.getItem('eaders-auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsLoggedIn(true);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem('eaders-auth');
      }
    }
  }, []);

  const handleLogin = () => {
    // Simulate login
    const mockUser = { name: 'Manga Fan', email: 'fan@example.com', imageUrl: 'https://placehold.co/40x40.png' };
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('eaders-auth', JSON.stringify({ user: mockUser }));
    toast({ title: "Logged In", description: "Welcome back, Manga Fan!" });
  };

  const handleLogout = () => {
    // Simulate logout
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('eaders-auth');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  if (isLoggedIn && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.imageUrl || `https://placehold.co/40x40.png`} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none font-headline">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/bookmarks">
              <Bookmark className="mr-2 h-4 w-4" />
              My Bookmarks
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={handleLogin} variant="outline">
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
};

export default AuthButtonClient;
