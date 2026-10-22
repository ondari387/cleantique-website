import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Set NEXT_PUBLIC_NOINDEX=1 on staging/preview deployments to block all crawling. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/cms/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
