import type { MetadataRoute } from "next";
import { getAllPosts, getAllServices, postCategories } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);
  const core = [
    { path: "/", priority: 1, freq: "weekly" },
    { path: "/services/", priority: 0.9, freq: "monthly" },
    { path: "/about/", priority: 0.6, freq: "yearly" },
    { path: "/contact/", priority: 0.7, freq: "yearly" },
    { path: "/request-quote/", priority: 0.7, freq: "yearly" },
    { path: "/our-process/", priority: 0.5, freq: "yearly" },
    { path: "/faqs/", priority: 0.6, freq: "monthly" },
    { path: "/reviews/", priority: 0.5, freq: "monthly" },
    { path: "/blog/", priority: 0.7, freq: "weekly" },
    { path: "/privacy-policy/", priority: 0.2, freq: "yearly" },
    { path: "/terms-of-service/", priority: 0.2, freq: "yearly" },
  ] as const;

  return [
    ...core.map((c) => ({ url: absoluteUrl(c.path), lastModified: today, changeFrequency: c.freq, priority: c.priority })),
    ...getAllServices().map((s) => ({
      url: absoluteUrl(s.path),
      lastModified: s.updated || today,
      changeFrequency: "monthly" as const,
      priority: s.kind === "parent" ? 0.9 : 0.8,
    })),
    ...postCategories.map((c) => ({
      url: absoluteUrl(`/blog/category/${c.key}/`),
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...getAllPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}/`),
      lastModified: p.updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
