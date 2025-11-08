import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast'
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
  metadataBase: new URL('https://puranveshana.vercel.app'),
  title: {
    default: "Puranveshana - Heritage Discovery & Archaeological Site Verification",
    template: "%s | Puranveshana"
  },
  description: "Discover, document, and verify India's rich heritage sites with Puranveshana. Upload archaeological images with EXIF metadata verification, explore historical locations, and earn rewards for heritage preservation.",
  keywords: [
    "puranveshaa",
    "puranveshana",
    "heritage discovery",
    "archaeological sites India",
    "historical monuments",
    "EXIF metadata verification",
    "heritage preservation",
    "Indian archaeology",
    "monument documentation",
    "cultural heritage India",
    "heritage mapping",
    "archaeological verification"
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
    title: "Puranveshana - Heritage Discovery & Archaeological Site Verification",
    description: "Discover, document, and verify India's rich heritage sites with Puranveshana. Upload archaeological images with EXIF metadata verification.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Puranveshana - Heritage Discovery Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puranveshana - Heritage Discovery & Archaeological Site Verification",
    description: "Discover, document, and verify India's rich heritage sites with Puranveshana.",
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
    google: 'your-google-site-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Puranveshana',
    alternateName: 'Puranveshaa',
    url: 'https://puranveshana.vercel.app',
    description: 'Discover, document, and verify India\'s rich heritage sites with EXIF metadata verification.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://puranveshana.vercel.app/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Puranveshana',
      logo: {
        '@type': 'ImageObject',
        url: 'https://puranveshana.vercel.app/logo.png'
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e293b" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
