import type { NextConfig } from "next";

// Static-export PWA for v1 (all data is client-side mock) — deployable to any
// static host. NEXT_PUBLIC_BASE_PATH is set in CI for GitHub Pages project
// hosting (/ClubRun); empty locally. The backend milestone (M3) moves to a
// server runtime and drops `output: "export"`.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
