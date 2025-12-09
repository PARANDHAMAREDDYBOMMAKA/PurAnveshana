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
  },
  // Enable compression for better performance (helps SEO)
  compress: true,
  // Optimize power usage during builds
  poweredByHeader: false,
  // Trailing slashes for better URL consistency
  trailingSlash: false,
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
            value: "connect-src 'self' https://challenges.cloudflare.com https://*.supabase.co https://*.r2.dev https://*.r2.cloudflarestorage.com https://translate.googleapis.com https://translate-pa.googleapis.com https://nominatim.openstreetmap.org https://res.cloudinary.com https://api.cloudinary.com https://www.googletagmanager.com"
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
