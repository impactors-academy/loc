import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone output is only for Docker self-hosting.
  // Vercel manages its own pipeline — set NEXT_BUILD_STANDALONE=true
  // in Dockerfile build args only; leave unset on Vercel.
  output: process.env.NEXT_BUILD_STANDALONE === "true" ? "standalone" : undefined,
};

export default nextConfig;
