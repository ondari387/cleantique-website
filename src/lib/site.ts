import siteData from "@content/site.json";

export const site = siteData;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || site.url).replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const telHref = `tel:${site.phone}`;
export const mailHref = `mailto:${site.email}`;

/** WhatsApp click-to-chat link with an optional pre-filled message. */
export function whatsappHref(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Service-specific WhatsApp opener, e.g. "bed bug control". */
export function serviceWhatsappMessage(service?: string, location?: string) {
  if (!service) return "Hello Cleantique, I would like to ask about your services.";
  return `Hello Cleantique, I would like a quotation for ${service}${location ? ` in ${location}` : ""}.`;
}
