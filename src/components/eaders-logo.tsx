import Link from 'next/link';
import EadersLogoComponent from './eaders-logo-component'; // Import the new SVG component

const EadersLogo = () => {
  return (
    <Link href="/" className="flex items-center group" aria-label="Eaders Home">
      <EadersLogoComponent className="h-10 w-auto group-hover:opacity-90 transition-opacity" />
      {/* The text is now part of EadersLogoComponent SVG. 
          If a separate textual link is needed for SEO/accessibility beyond SVG's aria-label, 
          it could be added here with sr-only class.
      */}
    </Link>
  );
};

export default EadersLogo;
