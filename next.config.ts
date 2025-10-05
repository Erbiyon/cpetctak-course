import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static file serving from public directory
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

  // Configure image optimization
  images: {
    domains: [],
    unoptimized: true, // Disable Next.js image optimization for uploaded files
  },

  // Ensure static files are served correctly
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'production'
              ? 'public, max-age=0, must-revalidate' // No cache in production for uploads
              : 'no-cache', // No cache in development
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
