import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  // Enable SWC minifier for faster builds (default in Next.js 16)
  swcMinify: true,
  // Experimental features for better performance
  experimental: {
    // Optimize CSS loading
    optimizeCss: true,
  },
  // Ensure security headers are properly set
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://cdn.jsdelivr.net https://www.googletagmanager.com https://*.posthog.com https://us-assets.i.posthog.com; connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.r2.dev https://*.r2.cloudflarestorage.com https://translate.googleapis.com https://translate-pa.googleapis.com https://nominatim.openstreetmap.org https://res.cloudinary.com https://api.cloudinary.com https://www.googletagmanager.com https://*.posthog.com"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), geolocation=(self), microphone=()'
          },
        ],
      },
    ]
  },
};

export default nextConfig;
