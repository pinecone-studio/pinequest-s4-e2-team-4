import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
   
    unoptimized: true, 
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;