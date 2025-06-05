const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Eaders by Nizami LTD. All rights reserved.</p>
        <p className="mt-1">Discover and read your favorite manga.</p>
      </div>
    </footer>
  );
};

export default Footer;
