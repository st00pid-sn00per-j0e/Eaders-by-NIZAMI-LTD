import Link from 'next/link';

const EadersLogo = () => {
  return (
    <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-primary/90 transition-colors">
      Eaders <sub className="text-xs font-medium">by Nizami LTD</sub>
    </Link>
  );
};

export default EadersLogo;
