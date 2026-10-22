"use client";

import Script from "next/script";
import { useEffect } from "react";
import { site } from "@/lib/site";

/**
 * Preserves the tracking that runs on the current site:
 *   - Google Tag Manager container (GTM-W6H9BJJW)
 *   - GA4 (G-S8NSBKQZ35) and Google Ads (AW-17497576869) via gtag.js
 * IDs can be overridden with NEXT_PUBLIC_* env vars. If the GTM container already
 * fires GA4/Ads tags, set NEXT_PUBLIC_DISABLE_GTAG=1 to avoid double counting.
 *
 * Conversion events pushed to dataLayer (and sent to GA4 via gtag):
 *   click_call, click_whatsapp, click_email, generate_lead (quote form success)
 */
const GTM = process.env.NEXT_PUBLIC_GTM_ID ?? site.analytics.gtmId;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID ?? site.analytics.ga4Id;
const ADS = process.env.NEXT_PUBLIC_ADS_ID ?? site.analytics.adsId;
const GTAG_ENABLED = process.env.NEXT_PUBLIC_DISABLE_GTAG !== "1";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
  if (GTAG_ENABLED && window.gtag) window.gtag("event", name, params);
  const adsLabel = process.env.NEXT_PUBLIC_ADS_LEAD_LABEL;
  if (name === "generate_lead" && adsLabel && window.gtag) {
    window.gtag("event", "conversion", { send_to: `${ADS}/${adsLabel}` });
  }
}

export function Analytics() {
  // Delegate clicks on tel:, WhatsApp and mailto: links anywhere on the page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.("a") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const explicit = a.dataset.track;
      let name = explicit;
      if (!name) {
        if (href.startsWith("tel:")) name = "click_call";
        else if (href.includes("wa.me/")) name = "click_whatsapp";
        else if (href.startsWith("mailto:")) name = "click_email";
      }
      if (name) trackEvent(name, { link_url: href, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_ANALYTICS_IN_DEV !== "1") return null;

  return (
    <>
      {GTM && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}
      {GTAG_ENABLED && GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4}');${ADS ? `gtag('config','${ADS}');` : ""}`}
          </Script>
        </>
      )}
    </>
  );
}

export function GtmNoScript() {
  if (!GTM) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  );
}
