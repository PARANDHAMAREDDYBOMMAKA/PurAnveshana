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
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression for better performance (helps SEO)
  compress: true,
  // Optimize power usage during builds
  poweredByHeader: false,
  // Trailing slashes for better URL consistency
  trailingSlash: false,
};

export default nextConfig;
