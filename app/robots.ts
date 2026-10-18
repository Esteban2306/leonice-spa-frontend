import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/src/features/landing/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/cancelar"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
