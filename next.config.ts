import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Hint Turbopack to use this folder as the workspace root to silence
   * multi-lockfile inference warnings when building.
   */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
