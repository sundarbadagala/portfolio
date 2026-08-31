import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/shared/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_CONFIG.url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
