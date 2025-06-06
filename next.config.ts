import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.kravemarketingllc.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "google.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
