import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.189"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kravemarketingllc.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "https://images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
