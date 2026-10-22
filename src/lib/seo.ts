import type { Metadata } from "next";
import { absoluteUrl, site, SITE_URL } from "./site";
import { getImage } from "./images";

type MetaInput = {
  title: string; // full <title>, already including brand where wanted
  description: string;
  path: string;
  image?: string; // image registry key
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata(m: MetaInput): Metadata {
  const url = absoluteUrl(m.path);
  const img = m.image ? getImage(m.image) : null;
  const ogImage = img ? absoluteUrl(img.src) : absoluteUrl("/brand/og-default.png");
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: url },
    robots: m.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph:
      m.type === "article"
        ? {
            type: "article",
            url,
            siteName: site.name,
            title: m.title,
            description: m.description,
            locale: "en_KE",
            images: [{ url: ogImage, alt: img?.alt ?? site.name }],
            publishedTime: m.publishedTime,
            modifiedTime: m.modifiedTime,
          }
        : {
            type: "website",
            url,
            siteName: site.name,
            title: m.title,
            description: m.description,
            locale: "en_KE",
            images: [{ url: ogImage, alt: img?.alt ?? site.name }],
          },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [ogImage],
    },
  };
}

/* ---------------- Structured data (JSON-LD) ----------------
 * Only verified, visible business facts are used. No ratings, reviews,
 * awards or certifications are marked up.
 */

export const ORG_ID = `${SITE_URL}/#organization`;
export const BUSINESS_ID = `${SITE_URL}/#localbusiness`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        url: SITE_URL,
        logo: absoluteUrl("/brand/cleantique-logo-full-transparent.png"),
        email: site.email,
        telephone: site.phone,
      },
      {
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: site.name,
        url: SITE_URL,
        image: absoluteUrl("/brand/cleantique-logo-full-transparent.png"),
        telephone: site.phone,
        email: site.email,
        parentOrganization: { "@id": ORG_ID },
        address: {
          "@type": "PostalAddress",
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        areaServed: site.serviceAreas.map((a) => ({ "@type": "Place", name: `${a}, Nairobi` })),
        openingHoursSpecification: site.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.schema,
          opens: h.open,
          closes: h.close,
        })),
        hasMap: site.mapsUrl,
        knowsAbout: [
          "Pest control",
          "Fumigation",
          "Bed bug control",
          "Cockroach control",
          "Mosquito control",
          "Rodent control",
          "Residential cleaning",
          "Office cleaning",
          "Post-construction cleaning",
          "House moving",
          "Office relocation",
          "Goods transportation",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: site.name,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-KE",
      },
    ],
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceSchema(s: { name: string; description: string; path: string; serviceType: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.serviceType,
    description: s.description,
    url: absoluteUrl(s.path),
    image: s.image ? absoluteUrl(getImage(s.image).src) : undefined,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: "Nairobi" },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleSchema(p: {
  title: string;
  description: string;
  path: string;
  image: string;
  date: string;
  updated: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    mainEntityOfPage: absoluteUrl(p.path),
    image: absoluteUrl(getImage(p.image).src),
    datePublished: p.date,
    dateModified: p.updated,
    author: { "@type": "Organization", name: p.author, url: SITE_URL },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-KE",
  };
}
