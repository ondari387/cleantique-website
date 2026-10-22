"use client";

import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { telHref, whatsappHref, serviceWhatsappMessage } from "@/lib/site";
import divisions from "@content/divisions.json";

/** Discreet sticky Call / WhatsApp / Quote bar, mobile only. WhatsApp text follows the page's service. */
export function MobileContactBar() {
  const pathname = usePathname() || "/";
  const service = (() => {
    for (const d of divisions) {
      if (pathname.startsWith(d.path)) {
        const child = d.children.find((c) => pathname.startsWith(c.path.split("#")[0]) && !c.path.includes("#"));
        return child ? child.name.toLowerCase() : d.whatsapp;
      }
    }
    return undefined;
  })();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-3 text-center font-ui text-[0.82rem] font-semibold text-ink">
        <a href={telHref} data-track="click_call" className="flex flex-col items-center gap-1 py-2.5">
          <Icon name="phone" className="h-5 w-5 text-brand-700" />
          Call
        </a>
        <a
          href={whatsappHref(serviceWhatsappMessage(service))}
          data-track="click_whatsapp"
          target="_blank"
          rel="noopener"
          className="flex flex-col items-center gap-1 border-x border-line py-2.5"
        >
          <Icon name="whatsapp" className="h-5 w-5 text-[#1DA851]" />
          WhatsApp
        </a>
        <a href="/request-quote/" className="flex flex-col items-center gap-1 bg-sun py-2.5">
          <Icon name="clipboard" className="h-5 w-5" />
          Get a quote
        </a>
      </div>
    </div>
  );
}
