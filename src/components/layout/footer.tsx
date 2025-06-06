
import FeedbackForm from '@/components/feedback-form'; // Import the new component

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4">
        <FeedbackForm /> 
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Eaders by Nizami LTD. All rights reserved.</p>
          <p className="mt-1">Discover and read your favorite manga.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
