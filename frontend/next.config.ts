import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const monorepoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const nextConfig: NextConfig = {
  // Hide Next.js "N" badge while running next dev on EC2.
  devIndicators: false,
  // Production EC2 build: don't block deploy on existing strict TS edge cases.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Temporary while production build hits Next.js /_global-error bug.
  allowedDevOrigins: [
    "13.205.91.11",
    "13.201.222.98",
    "13.201.222.90",
    "http://13.205.91.11",
    "http://13.201.222.98",
    "http://13.201.222.90",
  ],
  serverExternalPackages: ["playwright"],
  turbopack: {
    root: monorepoRoot,
  },
  async redirects() {
    return [
      {
        source: "/editor/dashboard",
        destination: "/user/dashboard",
        permanent: false,
      },
      {
        source: "/editor/dashboard/:tab",
        destination: "/user/:tab",
        permanent: false,
      },
    ];
  },
  experimental: {
    proxyClientMaxBodySize: "50mb",
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2attmqgyy4lt0.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
