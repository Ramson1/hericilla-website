import type { MetadataRoute } from "next";
import { services } from "@/lib/company";
import { getPosts, siteUrl } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts(100);
  const now = new Date();

  const statics: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/services",
    "/why-us",
    "/projects",
    "/hseq",
    "/careers",
    "/blog",
    "/testimonials",
    "/contact",
    "/quote",
    "/status",
    "/privacy",
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency: "weekly", priority: path === "" ? 1 : 0.7 }));

  return [
    ...statics,
    ...services.map((s) => ({ url: `${siteUrl}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({
      url: `${siteUrl}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : now,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
