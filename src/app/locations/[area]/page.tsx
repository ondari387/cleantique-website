import { notFound } from "next/navigation";
import { getAllLocations, getLocation } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand, CheckList, Prose, Toc } from "@/components/ui";

type Params = { area: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllLocations().map((l) => ({ area: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { area } = await params;
  const loc = getLocation(area);
  if (!loc) return {};
  return buildMetadata({ title: loc.seoTitle, description: loc.description, path: `/locations/${loc.slug}/`, image: loc.image });
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { area } = await params;
  const loc = getLocation(area);
  if (!loc) notFound();

  return (
    <>
      <PageHero
        crumbs={[{ name: "Areas we serve", path: "/locations/" }, { name: loc.name, path: `/locations/${loc.slug}/` }]}
        title={loc.h1}
        lede={loc.lede}
        image={loc.image}
      />

      <section className="container grid gap-12 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <article>
          {loc.highlights.length > 0 && (
            <div className="mb-10 rounded-card bg-paper p-6">
              <CheckList items={loc.highlights} />
            </div>
          )}
          <Prose html={loc.html} />
        </article>
        <aside className="space-y-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <Toc items={loc.toc} />
          {loc.testimonial && (
            <figure className="rounded-card bg-paper p-6">
              <blockquote className="leading-relaxed text-ink">“{loc.testimonial.text}”</blockquote>
              <figcaption className="mt-4 text-[0.95rem] text-muted">
                <span className="font-ui font-semibold text-ink">{loc.testimonial.name}</span>, {loc.testimonial.area} · {loc.testimonial.service}
              </figcaption>
            </figure>
          )}
        </aside>
      </section>

      <CtaBand
        title={`Get a quote in ${loc.name}`}
        text="Tell us the service and the property, and we'll confirm the details and send a written quote before anything starts."
      />
    </>
  );
}
