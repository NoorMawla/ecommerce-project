import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob uploads from the admin product form
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Optional: stock photography while seeding
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;