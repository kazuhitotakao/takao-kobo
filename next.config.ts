import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // microCMS に登録したこのサービスの画像だけを next/image で最適化できるようにする
    remotePatterns: [new URL("https://images.microcms-assets.io/assets/5ff3daba55644182894fb7d6d45a404c/**")],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
