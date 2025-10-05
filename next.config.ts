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
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
