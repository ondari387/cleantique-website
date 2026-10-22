import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { mailHref, serviceWhatsappMessage, site, telHref, whatsappHref } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { Icon, type IconName } from "@/components/Icon";
import { FaqList } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Contact Cleantique Solutions | Call, WhatsApp or Email",
  description:
    "Contact Cleantique Solutions in Nairobi about pest control, cleaning, moving or transport. Call or WhatsApp +254 793 329 293 or email hi@cleantique.co.ke.",
  path: "/contact/",
});

const channels: { icon: IconName; title: string; value: string; href: string; note: string; track: string; external?: boolean }[] = [
  { icon: "phone", title: "Call us", value: site.phoneDisplay, href: telHref, note: "During working hours", track: "click_call" },
  { icon: "whatsapp", title: "WhatsApp", value: "Chat with us", href: whatsappHref(serviceWhatsappMessage()), note: "Fastest for quotes: send a photo", track: "click_whatsapp", external: true },
  { icon: "mail", title: "Email", value: site.email, href: mailHref, note: "For detailed enquiries and documents", track: "click_email" },
];

const contactFaqs = [
  { q: "How quickly will you reply?", a: "We respond to WhatsApp messages, calls and quote requests during working hours. Requests sent in the evening or overnight are picked up when we reopen." },
  { q: "Do you have an office I can visit?", a: "We are based in Nairobi and work at our clients' premises. Please contact us by phone, WhatsApp or email rather than visiting, so that we can arrange the right person to help." },
  { q: "Can I book a site visit?", a: "Yes. For office moves, post-construction cleans, large properties and heavy pest problems we usually arrange an inspection or survey before quoting. Ask when you contact us." },
  { q: "What information should I send for a quote?", a: "The service you need, your location, the type and size of the property, your preferred date and, if possible, a few photos. For transport, include the goods, approximate weight or volume, and both addresses." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact/" }]}
        title="Contact Cleantique Solutions"
        image="woman-relaxing-on-sofa-at-home"
        lede={<p>Tell us what you are dealing with and we will come back with the next steps and a quote. A photo on WhatsApp is usually the quickest route to an accurate price.</p>}
      />

      <section className="container py-12 md:py-16" aria-label="Ways to contact us">
        <ul className="grid gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <li key={c.title}>
              <a
                href={c.href}
                data-track={c.track}
                {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                className="group flex h-full items-start gap-4 rounded-card border border-line bg-white p-6 hover:border-brand-300"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-ui text-sm text-muted">{c.title}</span>
                  <span className="mt-0.5 block font-ui text-[1.1rem] font-semibold text-ink group-hover:text-brand-700">{c.value}</span>
                  <span className="mt-1 block text-[0.92rem] text-muted">{c.note}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-card bg-paper p-6">
            <p className="flex items-center gap-2 font-ui font-semibold text-ink"><Icon name="clock" className="h-5 w-5 text-brand-700" /> Working hours</p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.97rem] text-ink-soft">
              <dt>Monday – Friday</dt><dd>9am – 6pm</dd>
              <dt>Saturday</dt><dd>9am – 4pm</dd>
              <dt>Sunday</dt><dd>9am – 4pm</dd>
            </dl>
          </div>
          <div className="rounded-card bg-paper p-6">
            <p className="flex items-center gap-2 font-ui font-semibold text-ink"><Icon name="pin" className="h-5 w-5 text-brand-700" /> Location</p>
            <p className="mt-3 text-[0.97rem] text-ink-soft">Nairobi, Kenya. We work at our clients' homes and premises.</p>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="mt-3 inline-flex font-ui text-[0.95rem] font-semibold text-brand-700 hover:underline">
              View on Google Maps
            </a>
          </div>
          <div className="rounded-card bg-paper p-6">
            <p className="flex items-center gap-2 font-ui font-semibold text-ink"><Icon name="shield" className="h-5 w-5 text-brand-700" /> Areas we serve</p>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-ink-soft">{site.serviceAreas.join(", ")} and nearby areas.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white" aria-labelledby="enquiry-form">
        <div className="container grid gap-12 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div>
            <h2 id="enquiry-form" className="font-display text-display-md font-semibold text-ink">Send us an enquiry</h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">Choose the service first and the form will ask only what we need for that job.</p>
            <div className="mt-8">
              <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
                <QuoteForm compact />
              </Suspense>
            </div>
          </div>
          <div>
            <h2 className="font-display text-display-md font-semibold text-ink">Contact questions</h2>
            <div className="mt-6">
              <FaqList faqs={contactFaqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
