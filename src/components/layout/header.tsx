import Link from 'next/link';
import EadersLogo from '@/components/eaders-logo';
import AuthButtonClient from '@/components/auth-button-client';
import { Button } from '@/components/ui/button';
import { Home, Tag } from 'lucide-react'; // Added Tag icon

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <EadersLogo />
          <nav className="flex items-center space-x-1"> {/* Always flex, space between items */}
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center text-sm font-medium text-foreground/70 hover:text-foreground p-2 md:px-3 md:py-2">
                <Home className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/categories" className="flex items-center text-sm font-medium text-foreground/70 hover:text-foreground p-2 md:px-3 md:py-2">
                <Tag className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Categories</span>
              </Link>
            </Button>
            {/* Add more navigation links here if needed */}
          </nav>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Placeholder for a global search button if needed outside home */}
          {/* <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button> */}
          <AuthButtonClient />
        </div>
      </div>
    </header>
  );
};

export default Header;
