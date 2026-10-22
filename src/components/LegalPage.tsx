import { getPage } from "@/lib/content";
import { PageHero } from "./PageHero";
import { Prose } from "./ui";

export function LegalPage({ slug, path }: { slug: string; path: string }) {
  const page = getPage(slug);
  return (
    <>
      <PageHero crumbs={[{ name: page.title, path }]} title={page.h1} lede={<p>{page.lede}</p>}>
        <p className="mt-4 text-[0.95rem] text-muted">Last updated: {new Date(page.updated).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</p>
      </PageHero>
      <section className="container py-12 md:py-16">
        <Prose html={page.html} />
      </section>
    </>
  );
}
