import type { MetadataRoute } from "next";
import { isProductionSite, siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  // Local development and preview deployments: ask search engines to stay out.
  if (!isProductionSite) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}