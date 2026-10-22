import Link from "next/link";
import { divisions, getService, readJson } from "@/lib/content";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { slugify } from "@/lib/markdown";
import { PageHero } from "@/components/PageHero";
import { CtaBand, FaqList, JsonLd } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions | Cleantique Solutions",
  description:
    "Answers to common questions about booking, quotes, areas covered, preparation, safety and payment for Cleantique's services in Nairobi.",
  path: "/faqs/",
});

type FaqGroup = { group: string; items: { q: string; a: string }[] };

export default function FaqsPage() {
  const groups = readJson<{ groups: FaqGroup[] }>("faqs.json").groups;
  const all = groups.flatMap((g) => g.items);
  return (
    <>
      <JsonLd data={faqSchema(all)} />
      <PageHero
        crumbs={[{ name: "FAQs", path: "/faqs/" }]}
        title="Frequently Asked Questions"
        lede={<p>General questions about working with us are answered here. For service-specific questions, such as how to prepare for bed bug treatment or what a moving quote includes, see the FAQ section on each service page.</p>}
      />
      <div className="container grid gap-12 py-12 md:py-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="FAQ topics" className="lg:sticky lg:top-32 lg:self-start">
          <p className="font-ui text-sm font-semibold text-ink">Topics</p>
          <ul className="mt-3 space-y-2 text-[0.97rem]">
            {groups.map((g) => (
              <li key={g.group}><a href={`#${slugify(g.group)}`} className="text-muted hover:text-brand-700">{g.group}</a></li>
            ))}
            <li><a href="#service-faqs" className="text-muted hover:text-brand-700">Service-specific questions</a></li>
          </ul>
        </nav>
        <div className="max-w-3xl space-y-14">
          {groups.map((g) => (
            <section key={g.group} aria-labelledby={slugify(g.group)}>
              <h2 id={slugify(g.group)} className="font-display text-display-md font-semibold text-ink">{g.group}</h2>
              <div className="mt-6"><FaqList faqs={g.items} /></div>
            </section>
          ))}
          <section aria-labelledby="service-faqs">
            <h2 id="service-faqs" className="font-display text-display-md font-semibold text-ink">Service-specific questions</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {divisions.map((d) => (
                <div key={d.key} className="rounded-card border border-line p-5">
                  <p className="font-ui font-semibold text-ink">{d.name}</p>
                  <ul className="mt-3 space-y-2 text-[0.97rem]">
                    {[d.path, ...d.children.map((c) => c.path)]
                      .filter((p) => !p.includes("#"))
                      .map((p) => {
                        const s = getService(p);
                        return s ? (
                          <li key={p}>
                            <Link href={`${p}#faqs`} className="text-brand-700 hover:underline">
                              {s.title} FAQs ({s.faqs.length})
                            </Link>
                          </li>
                        ) : null;
                      })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <CtaBand title="Still have a question?" text="Send us a message on WhatsApp or call us during working hours. We are happy to help you work out what you need before you book." />
    </>
  );
}
