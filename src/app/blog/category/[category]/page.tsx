import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategory, postCategories, type PostCategory } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { BlogHeader, PostGrid } from "@/components/BlogIndex";
import { CtaBand } from "@/components/ui";

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return postCategories.map((c) => ({ category: c.key }));
}

const servicePath: Record<PostCategory, string> = {
  "pest-control": "/services/pest-control/",
  cleaning: "/services/cleaning/",
  "moving-relocation": "/services/moving-relocation/",
  "transport-logistics": "/services/transport-logistics/",
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = postCategories.find((x) => x.key === category);
  if (!c) return {};
  return buildMetadata({
    title: `${c.name} Guides & Advice | Cleantique Blog`,
    description: `${c.description} Guides for Nairobi homes and businesses.`,
    path: `/blog/category/${c.key}/`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = postCategories.find((x) => x.key === category);
  if (!c) notFound();
  const posts = getPostsByCategory(c.key);
  return (
    <>
      <BlogHeader
        active={c.key}
        crumbs={[
          { name: "Blog", path: "/blog/" },
          { name: c.name, path: `/blog/category/${c.key}/` },
        ]}
        title={`${c.name} guides and advice`}
        intro={c.description}
      />
      <div className="container py-12 md:py-16">
        <PostGrid posts={posts} headingLevel={2} />
        <p className="mt-12 text-lg text-muted">
          Looking for the service itself?{" "}
          <Link href={servicePath[c.key]} className="font-medium text-brand-700 underline underline-offset-4">
            See our {c.name.toLowerCase()} services
          </Link>
          .
        </p>
      </div>
      <CtaBand
        title={`Need help with ${c.name.toLowerCase()}?`}
        text="Tell us what you need and where. We will confirm the details and send you a written quote."
        quoteHref={`/request-quote/?service=${c.key}`}
        service={c.name.toLowerCase()}
      />
    </>
  );
}
