import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Se fija al compilar: así el modo de caché es el mismo en el servidor aunque el Worker no reciba la variable.
  env: { PUBLIC_CACHE_MODE: process.env.PUBLIC_CACHE_MODE ?? "" },
  experimental: {
    optimizePackageImports: ["@base-ui/react", "react-day-picker", "motion", "gsap"],
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/images/cloudinary-loader.ts",
    deviceSizes: [480, 768, 1080],
    imageSizes: [256],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
