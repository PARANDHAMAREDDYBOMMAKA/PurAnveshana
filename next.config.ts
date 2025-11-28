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
        ],
      },
    ]
  },
};

export default nextConfig;
