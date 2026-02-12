import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'e0aa73ca533eaff608354227a76ab292.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-fd847e78f5c44470828fed94407dd880.r2.dev',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // Cache images for 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression for better performance (helps SEO)
  compress: true,
  // Optimize power usage during builds
  poweredByHeader: false,
  // Trailing slashes for better URL consistency
  trailingSlash: false,
  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@heroicons/react',
      'react-hot-toast',
    ],
  },
  // Cloudflare CDN-optimized caching headers
  async headers() {
    return [
      // Static assets — long cache with immutable hint for Cloudflare edge
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
      // Fonts, icons, and media in public/
      {
        source: '/(.*)\\.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot|mp4)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
      // Next.js optimized images
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'max-age=604800',
          },
        ],
      },
      // API routes — never cache at CDN edge
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-store, no-cache, must-revalidate',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-store',
          },
        ],
      },
      // All pages — security headers + short CDN cache for HTML
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://*.posthog.com https://us-assets.i.posthog.com https://*.hs-scripts.com https://*.hs-analytics.net https://*.hs-banner.com https://*.usemessages.com https://forms.hsforms.com https://js-na2.hscollectedforms.net https://*.contentsquare.net; connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.r2.dev https://*.r2.cloudflarestorage.com https://translate.googleapis.com https://translate-pa.googleapis.com https://nominatim.openstreetmap.org https://res.cloudinary.com https://api.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://*.posthog.com https://*.hubspot.com https://*.hubspotusercontent.com https://*.hsforms.com https://*.hscollectedforms.net https://*.hs-analytics.net https://*.contentsquare.net; frame-src 'self' https://challenges.cloudflare.com https://maps.google.com https://www.google.com/maps https://www.googletagmanager.com https://googleads.g.doubleclick.net",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), geolocation=(self), microphone=()',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
