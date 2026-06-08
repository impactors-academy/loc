import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // required for production Docker image (copies .next/standalone)
};

export default nextConfig;
