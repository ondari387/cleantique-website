import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { site, telHref, whatsappHref, serviceWhatsappMessage } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { Icon } from "@/components/Icon";
import { CheckList } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Request a Free Quote | Cleantique Solutions Nairobi",
  description:
    "Request a free quote for pest control, cleaning, moving or goods transport in Nairobi. Choose a service, describe the job and we will be in touch.",
  path: "/request-quote/",
});

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Request a quote", path: "/request-quote/" }]}
        title="Request a Free Quote"
        lede={<p>Choose the service, tell us about the job and how to reach you. It takes about two minutes, and there is no obligation to book.</p>}
      />
      <section className="container grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div>
          <Suspense fallback={<p className="text-muted">Loading the form…</p>}>
            <QuoteForm />
          </Suspense>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <div className="rounded-card bg-paper p-6">
            <h2 className="font-ui text-lg font-semibold text-ink">What happens next</h2>
            <ol className="mt-4 space-y-3 text-[0.97rem] leading-relaxed text-ink-soft">
              <li><strong className="text-ink">1.</strong> We review your request and contact you during working hours.</li>
              <li><strong className="text-ink">2.</strong> We confirm the details, and arrange an inspection, survey or video call if the job needs one.</li>
              <li><strong className="text-ink">3.</strong> You receive a written quote that sets out what is included.</li>
              <li><strong className="text-ink">4.</strong> You choose a date, and we send preparation guidance.</li>
            </ol>
          </div>
          <div className="rounded-card border border-line p-6">
            <h2 className="font-ui text-lg font-semibold text-ink">Faster on WhatsApp</h2>
            <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">A photo of the room, the pest or the items to move helps us price accurately.</p>
            <a
              href={whatsappHref(serviceWhatsappMessage())}
              target="_blank"
              rel="noopener"
              data-track="click_whatsapp"
              className="mt-4 inline-flex items-center gap-2 font-ui font-semibold text-brand-700 hover:underline"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> Chat on WhatsApp
            </a>
            <a href={telHref} data-track="click_call" className="mt-3 flex items-center gap-2 font-ui font-semibold text-brand-700 hover:underline">
              <Icon name="phone" className="h-5 w-5" /> {site.phoneDisplay}
            </a>
          </div>
          <div className="rounded-card border border-line p-6">
            <h2 className="font-ui text-lg font-semibold text-ink">Good to know</h2>
            <CheckList
              className="mt-4 text-[0.95rem] text-ink-soft"
              items={[
                "Quotes are free and written",
                "You can book several services in one request",
                "Pest control quotes include any follow-up visit the pest needs",
              ]}
            />
          </div>
        </aside>
      </section>
    </>
  );
}
