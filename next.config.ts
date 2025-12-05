import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" - this app requires server-side features
  // for authentication, payments, and Convex integration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
