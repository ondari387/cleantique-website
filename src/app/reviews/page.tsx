import Link from "next/link";
import { readJson, divisions } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Customer Reviews | Cleantique Solutions Nairobi",
  description: "What Cleantique clients in Nairobi say about our cleaning, pest control and fumigation services, shared with their permission.",
  path: "/reviews/",
});

type Review = { name: string; area: string; service: string; division: string; text: string };

export default function ReviewsPage() {
  const data = readJson<{ googleReviewsUrl: string; reviews: Review[] }>("reviews.json");
  const byDivision = divisions
    .map((d) => ({ d, items: data.reviews.filter((r) => r.division === d.key) }))
    .filter((g) => g.items.length);

  return (
    <>
      <PageHero
        crumbs={[{ name: "Customer reviews", path: "/reviews/" }]}
        title="Customer Reviews"
        lede={
          <p>
            Feedback from clients across Nairobi, published with their permission. If you have used our services recently, we would
            be grateful for your review{data.googleReviewsUrl ? " on Google" : ""}. It helps other people choose with confidence.
          </p>
        }
      />
      <div className="container space-y-16 py-12 md:py-16">
        {byDivision.map(({ d, items }) => (
          <section key={d.key} aria-labelledby={`rev-${d.key}`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id={`rev-${d.key}`} className="font-display text-display-md font-semibold text-ink">{d.name}</h2>
              <Link href={d.path} className="font-ui font-semibold text-brand-700 hover:underline">About {d.navName.toLowerCase()}</Link>
            </div>
            <div className="mt-8 columns-1 gap-6 md:columns-2 lg:columns-3">
              {items.map((r) => (
                <figure key={r.name} className="mb-6 break-inside-avoid rounded-card bg-paper p-7">
                  <blockquote className="text-[1.05rem] leading-relaxed text-ink">“{r.text}”</blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4 text-[0.95rem]">
                    <span className="font-ui font-semibold text-ink">{r.name}</span>
                    <span className="block text-muted">{r.area}, {r.service.toLowerCase()}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
        <section className="rounded-card border border-line p-7">
          <h2 className="font-ui text-lg font-semibold text-ink">Share your experience</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-muted">
            Used Cleantique recently? Send your feedback to <a className="text-brand-700 underline" href="mailto:hi@cleantique.co.ke">hi@cleantique.co.ke</a>
            {data.googleReviewsUrl && (
              <>
                {" "}or <a className="text-brand-700 underline" href={data.googleReviewsUrl} target="_blank" rel="noopener">leave a Google review</a>
              </>
            )}
            . We only publish reviews with the customer's permission.
          </p>
        </section>
      </div>
      <CtaBand title="Ready to book?" text="Tell us what you need and where. We will confirm the details and send you a written quote." />
    </>
  );
}
