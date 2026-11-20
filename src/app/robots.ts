import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * AI search and answer engines we explicitly welcome, alongside normal web crawlers
 * (SEO, AEO and GEO visibility - see docs/02-SEO-STRATEGY.md).
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "Meta-ExternalAgent",
  "CCBot",
];

/** Set NEXT_PUBLIC_NOINDEX=1 on staging/preview deployments to block all crawling. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cms/"] },
      { userAgent: aiCrawlers, allow: "/", disallow: ["/admin/", "/api/", "/cms/"] },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
