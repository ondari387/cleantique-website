import { getAllPosts, postCategories } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { BlogHeader, FeaturedPost, PostGrid } from "@/components/BlogIndex";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Pest Control, Cleaning & Moving Advice | Cleantique Blog",
  description:
    "Practical guides on pest control, cleaning, moving house or office and goods transport in Nairobi, written to answer the questions clients ask.",
  path: "/blog/",
});

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);
  return (
    <>
      <BlogHeader
        crumbs={[{ name: "Blog", path: "/blog/" }]}
        title="Pest Control, Cleaning, Moving and Logistics Advice"
        intro="Practical guides from the Cleantique team, written to answer the questions clients ask us before they book: what things cost, how to prepare, and how to avoid the common mistakes."
      />
      <div className="container space-y-16 py-12 md:py-16">
        {featured && <FeaturedPost post={featured} />}
        {postCategories.map((c) => {
          const items = rest.filter((p) => p.category === c.key);
          if (!items.length) return null;
          return (
            <section key={c.key} aria-labelledby={`cat-${c.key}`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 id={`cat-${c.key}`} className="font-display text-display-md font-semibold text-ink">{c.name}</h2>
                  <p className="mt-2 text-muted">{c.description}</p>
                </div>
                <Link href={`/blog/category/${c.key}/`} className="font-ui font-semibold text-brand-700 hover:underline">All {c.name.toLowerCase()} articles</Link>
              </div>
              <div className="mt-8">
                <PostGrid posts={items.slice(0, 3)} />
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
