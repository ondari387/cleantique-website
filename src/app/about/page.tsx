import Image from "next/image";
import { getPage, readJson } from "@/lib/content";
import { getImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand, Prose, Toc } from "@/components/ui";

const page = getPage("about");

export const metadata = buildMetadata({
  title: page.seoTitle,
  description: page.description,
  path: "/about/",
  image: "cleaner-holding-cleaning-supplies",
});

type Review = { name: string; area: string; service: string; text: string };

export default function AboutPage() {
  const { reviews } = readJson<{ reviews: Review[] }>("reviews.json");
  const wide = getImage("cleaning-team-in-kitchen-wide");
  return (
    <>
      <PageHero crumbs={[{ name: "About us", path: "/about/" }]} title={page.h1} lede={page.lede} image="cleaner-holding-cleaning-supplies" />

      <section className="container grid gap-12 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <article>
          <Prose html={page.html} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <Toc items={page.toc} />
          <figure className="rounded-card bg-paper p-6">
            <blockquote className="leading-relaxed text-ink">“{reviews[7]?.text}”</blockquote>
            <figcaption className="mt-4 text-[0.95rem] text-muted">
              <span className="font-ui font-semibold text-ink">{reviews[7]?.name}</span>, {reviews[7]?.area}
            </figcaption>
          </figure>
        </aside>
      </section>

      <div className="container pb-16">
        <div className="relative aspect-[16/5] overflow-hidden rounded-[20px] bg-paper">
          <Image src={wide.src} alt={wide.alt} fill sizes="100vw" className="object-cover" />
        </div>
      </div>

      <CtaBand
        title="Tell us what you need"
        text="One request can cover a clean, a fumigation, a move or a delivery. We will confirm the details and send you a written quote."
      />
    </>
  );
}
