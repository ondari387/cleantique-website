import Link from "next/link";
import divisions from "@content/divisions.json";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { site, telHref, mailHref, whatsappHref, serviceWhatsappMessage } from "@/lib/site";

function fmtTime(t: string) {
  const h = Number(t.slice(0, 2));
  return h === 12 ? "12pm" : h > 12 ? `${h - 12}pm` : `${h}am`;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-900 text-white/80">
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="inline-block rounded-xl bg-white px-4 py-3">
            <Logo className="h-10 w-auto" />
          </div>
          <p className="mt-6 max-w-sm leading-relaxed">
            Pest control, cleaning, moving and goods transport for homes, offices and property managers in Nairobi, arranged
            through one team.
          </p>
          <ul className="mt-6 space-y-3 text-[0.97rem]">
            <li>
              <a href={telHref} data-track="click_call" className="flex items-center gap-3 hover:text-white">
                <Icon name="phone" className="h-5 w-5 text-brand-300" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappHref(serviceWhatsappMessage())} data-track="click_whatsapp" target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-white">
                <Icon name="whatsapp" className="h-5 w-5 text-brand-300" /> Chat on WhatsApp
              </a>
            </li>
            <li>
              <a href={mailHref} data-track="click_email" className="flex items-center gap-3 hover:text-white">
                <Icon name="mail" className="h-5 w-5 text-brand-300" /> {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="pin" className="h-5 w-5 text-brand-300" /> Nairobi, Kenya
            </li>
          </ul>
          <div className="mt-6">
            <p className="font-ui text-sm font-semibold text-white">Opening hours</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.95rem]">
              {site.hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt>{h.days}</dt>
                  <dd>
                    {fmtTime(h.open)} – {fmtTime(h.close)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((d) => (
            <div key={d.key}>
              <p className="font-ui font-semibold text-white">
                <Link href={d.path} className="hover:text-brand-200">{d.name}</Link>
              </p>
              <ul className="mt-4 space-y-2 text-[0.95rem]">
                {d.children.map((c) => (
                  <li key={c.path}>
                    <Link href={c.path} className="hover:text-white">{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-ui font-semibold text-white">Company</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-[0.95rem]">
              <li><Link href="/about/" className="hover:text-white">About us</Link></li>
              <li><Link href="/our-process/" className="hover:text-white">Our process</Link></li>
              <li><Link href="/reviews/" className="hover:text-white">Customer reviews</Link></li>
              <li><Link href="/faqs/" className="hover:text-white">FAQs</Link></li>
              <li><Link href="/blog/" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact/" className="hover:text-white">Contact</Link></li>
              <li><Link href="/request-quote/" className="hover:text-white">Request a quote</Link></li>
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-ui font-semibold text-white">Areas we serve</p>
            <p className="mt-4 text-[0.95rem] leading-relaxed">{site.serviceAreas.join(", ")} and nearby. Ask us about locations not listed.</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Cleantique Solutions. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><Link href="/privacy-policy/" className="hover:text-white">Privacy policy</Link></li>
            <li><Link href="/terms-of-service/" className="hover:text-white">Terms of service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
