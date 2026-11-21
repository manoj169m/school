import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Ensures strict mode is enabled
  images: {
    domains: ["images.unsplash.com"], // Allows images from Unsplash
  },
};

export default nextConfig;
