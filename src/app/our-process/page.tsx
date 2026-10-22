import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand, Prose, Toc } from "@/components/ui";

const page = getPage("our-process");

export const metadata = buildMetadata({ title: page.seoTitle, description: page.description, path: "/our-process/", image: "cleaner-holding-cleaning-supplies" });

export default function ProcessPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Our process", path: "/our-process/" }]} title={page.h1} lede={page.lede} image="packed-boxes-and-covered-sofa-house-move" />
      <section className="container grid gap-12 py-14 md:py-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <article><Prose html={page.html} /></article>
        <aside className="lg:sticky lg:top-32 lg:self-start"><Toc items={page.toc} /></aside>
      </section>
      <CtaBand title="Start with a quick message" text="Tell us the service, your location and when you need it. We will take it from there." />
    </>
  );
}
