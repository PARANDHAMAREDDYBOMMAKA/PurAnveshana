import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'
import TranslateErrorBoundary from '@/components/TranslateErrorBoundary';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://puranveshana.com'),
  title: {
    default: "Puranveshana - Discover Indian History & Hidden Heritage Sites",
    template: "%s | Puranveshana"
  },
  description: "Uncover Indian history and explore India's hidden history with Puranveshana. Discover, document, and verify heritage sites, ancient monuments, and archaeological locations. Upload images of historical sites and earn rewards for heritage preservation.",
  keywords: [
    "puranveshaa",
    "puranveshana",
    "Indian history",
    "Indian hidden history",
    "heritage discovery",
    "archaeological sites India",
    "historical monuments",
    "heritage preservation",
    "Indian archaeology",
    "monument documentation",
    "cultural heritage India",
    "heritage mapping",
    "archaeological sites",
    "ancient India",
    "historical sites India",
    "Indian heritage sites",
    "forgotten monuments India",
    "heritage sites India"
  ],
  authors: [{ name: "Puranveshana Team" }],
  creator: "Puranveshana",
  publisher: "Puranveshana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://puranveshana.com",
    siteName: "Puranveshana",
    title: "Puranveshana - Uncover Indian History & Hidden Heritage Sites",
    description: "Explore Indian history and discover India's hidden history. Document ancient monuments, verify archaeological sites, and preserve our rich cultural heritage.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Puranveshana - Discover Indian History and Heritage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puranveshana - Uncover Indian History & Hidden Heritage Sites",
    description: "Explore Indian history and discover India's hidden history. Document ancient monuments and verify archaeological sites.",
    images: ["/og-image.jpg"],
    creator: "@puranveshana",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google3eea601a87f2daa0',
  },
  alternates: {
    canonical: 'https://puranveshana.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://puranveshana.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Puranveshana',
    alternateName: 'Puranveshaa',
    url: siteUrl,
    description: 'Uncover Indian history and explore India\'s hidden history. Discover, document, and verify heritage sites, ancient monuments, and archaeological locations across India.',
    about: {
      '@type': 'Thing',
      name: 'Indian History',
      description: 'Platform dedicated to exploring and preserving Indian history, heritage sites, and hidden historical monuments across India.'
    },
    keywords: 'Indian history, Indian hidden history, heritage discovery, archaeological sites India, ancient monuments',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puranveshana',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Suppress Google Translate DOM manipulation errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalError = window.onerror;
                window.onerror = function(message, source, lineno, colno, error) {
                  if (error && error.message && (
                    error.message.includes('removeChild') ||
                    error.message.includes('insertBefore') ||
                    error.message.includes('The node to be removed is not a child')
                  )) {
                    return true;
                  }
                  if (originalError) return originalError(message, source, lineno, colno, error);
                  return false;
                };
              }
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TranslateErrorBoundary>
          <Toaster position="top-right" />
          {children}
        </TranslateErrorBoundary>
      </body>
    </html>
  );
}
