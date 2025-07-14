import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '5000',
        pathname: '/media/**',
      },
      // Add other domains as needed for production
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.herokuapp.com',
        pathname: '/media/**',
      }
    ],
    // Optional: Configure image formats and sizes
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
