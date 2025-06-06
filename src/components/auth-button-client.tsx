
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, Bookmark, DollarSign, PlusCircle } from 'lucide-react';
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

const USER_BALANCE_KEY = 'eaders-user-balance';

const AuthButtonClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; imageUrl?: string } | null>(null);
  const [userBalance, setUserBalance] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const storedAuth = localStorage.getItem('eaders-auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsLoggedIn(true);
        setUser(authData.user);
        // Load balance
        const storedBalance = localStorage.getItem(USER_BALANCE_KEY);
        setUserBalance(storedBalance ? parseFloat(storedBalance) : 0);
      } catch (error) {
        localStorage.removeItem('eaders-auth');
        localStorage.removeItem(USER_BALANCE_KEY); // Clear balance on auth error
      }
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === USER_BALANCE_KEY) {
        setUserBalance(event.newValue ? parseFloat(event.newValue) : 0);
      }
      if (event.key === 'eaders-auth') {
        if (event.newValue) {
          try {
            const authData = JSON.parse(event.newValue);
            setIsLoggedIn(true);
            setUser(authData.user);
            const storedBalance = localStorage.getItem(USER_BALANCE_KEY);
            setUserBalance(storedBalance ? parseFloat(storedBalance) : 0);
          } catch { /* ignore */ }
        } else {
          setIsLoggedIn(false);
          setUser(null);
          setUserBalance(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogin = () => {
    const mockUser = { name: 'Manga Fan', email: 'fan@example.com', imageUrl: 'https://placehold.co/40x40.png' };
    setIsLoggedIn(true);
    setUser(mockUser);
    localStorage.setItem('eaders-auth', JSON.stringify({ user: mockUser }));
    
    // Initialize balance for new login if not present
    const storedBalance = localStorage.getItem(USER_BALANCE_KEY);
    const currentBalance = storedBalance ? parseFloat(storedBalance) : 0;
    localStorage.setItem(USER_BALANCE_KEY, currentBalance.toString());
    setUserBalance(currentBalance);

    toast({ title: "Logged In", description: "Welcome back, Manga Fan!" });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserBalance(0); // Reset balance display on logout
    localStorage.removeItem('eaders-auth');
    // localStorage.removeItem(USER_BALANCE_KEY); // Optionally clear balance on logout, or persist it
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };

  const handleAddCredits = () => {
    const newBalance = userBalance + 10;
    localStorage.setItem(USER_BALANCE_KEY, newBalance.toString());
    setUserBalance(newBalance);
    toast({ title: "Credits Added!", description: "$10.00 added to your balance." });
     // Dispatch a storage event so other components (like ChapterView) can update
    window.dispatchEvent(new StorageEvent('storage', {
      key: USER_BALANCE_KEY,
      newValue: newBalance.toString(),
    }));
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
        <DropdownMenuContent className="w-60" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none font-headline">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem className="focus:bg-transparent cursor-default hover:bg-transparent">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                    <span>Balance:</span>
                </div>
                <span className="font-semibold">${userBalance.toFixed(2)}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddCredits}>
            <PlusCircle className="mr-2 h-4 w-4 text-accent" />
            Add $10 Credits
          </DropdownMenuItem>
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
