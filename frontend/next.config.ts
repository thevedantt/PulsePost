import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images served from the Django backend
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
