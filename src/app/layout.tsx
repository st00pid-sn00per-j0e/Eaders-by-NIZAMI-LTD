import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const APP_NAME = "Eaders by Nizami LTD";
const APP_DESCRIPTION = "Your favorite manga reader, by Nizami LTD.";
const APP_THEME_COLOR = "#2A3B4C"; // Dark blue from logo

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
    // startUpImage: [], // Can add splash screen images for iOS
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: APP_THEME_COLOR,
  icons: {
    icon: "/icons/eaders-logomark.svg", // Main favicon
    shortcut: "/icons/eaders-logomark.svg",
    apple: "/icons/eaders-logomark.svg", // Apple touch icon
    // other: [ // For more specific sizes if needed
    //   { rel: 'icon', type: 'image/svg+xml', url: '/icons/eaders-logomark.svg' },
    //   { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/icons/eaders-logo-192.png' }, // if PNG versions are available
    //   { rel: 'icon', type: 'image/png', sizes: '512x512', url: '/icons/eaders-logo-512.png' }, // if PNG versions are available
    // ]
  },
  // openGraph: { // Optional: For social media sharing
  //   type: 'website',
  //   siteName: APP_NAME,
  //   title: APP_NAME,
  //   description: APP_DESCRIPTION,
  //   images: [
  //     {
  //       url: '/icons/eaders-logo-512.png', // A larger PNG for social cards
  //       width: 512,
  //       height: 512,
  //       alt: APP_NAME,
  //     },
  //   ],
  // },
  // twitter: { // Optional: For Twitter cards
  //   card: 'summary',
  //   title: APP_NAME,
  //   description: APP_DESCRIPTION,
  //   images: ['/icons/eaders-logo-512.png'], // A larger PNG for Twitter cards
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* PWA specific tags handled by manifest link now, 
            but ensuring theme-color is here for immediate browser effect */}
        <meta name="theme-color" content={APP_THEME_COLOR} />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
