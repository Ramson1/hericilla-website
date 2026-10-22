import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/db";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/quote/success"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
