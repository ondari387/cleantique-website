import Image from "next/image";
import Link from "next/link";
import { getAllPosts, postCategories, type Post, type PostCategory } from "@/lib/content";
import { getImage } from "@/lib/images";
import { BlogSearch } from "./BlogSearch";
import { Breadcrumbs, PostCard } from "./ui";

export function CategoryNav({ active }: { active?: PostCategory }) {
  return (
    <nav aria-label="Blog categories">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog/"
            aria-current={!active ? "page" : undefined}
            className={`inline-block whitespace-nowrap rounded-pill px-4 py-2 font-ui text-[0.95rem] font-medium ${!active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-brand-300"}`}
          >
            All articles
          </Link>
        </li>
        {postCategories.map((c) => (
          <li key={c.key}>
            <Link
              href={`/blog/category/${c.key}/`}
              aria-current={active === c.key ? "page" : undefined}
              className={`inline-block whitespace-nowrap rounded-pill px-4 py-2 font-ui text-[0.95rem] font-medium ${active === c.key ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-line hover:ring-brand-300"}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function searchIndex() {
  return getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    categoryName: postCategories.find((c) => c.key === p.category)?.name ?? "",
    keywords: p.toc.map((t) => t.text).join(" "),
  }));
}

export function BlogHeader({ title, intro, active, crumbs }: { title: string; intro: string; active?: PostCategory; crumbs: { name: string; path: string }[] }) {
  return (
    <section className="border-b border-line bg-paper">
      <div className="container py-10 md:py-14">
        <Breadcrumbs items={crumbs} />
        <h1 className="mt-8 max-w-3xl font-display text-display-lg font-semibold text-ink">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
        <div className="mt-8">
          <BlogSearch items={searchIndex()} />
        </div>
        <div className="mt-8">
          <CategoryNav active={active} />
        </div>
      </div>
    </section>
  );
}

export function FeaturedPost({ post }: { post: Post }) {
  const img = getImage(post.image);
  return (
    <article className="group relative grid overflow-hidden rounded-[20px] border border-line bg-white lg:grid-cols-[1.2fr_1fr]">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[340px]">
        <Image src={img.src} alt={img.alt} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center p-7 md:p-10">
        <p className="font-ui text-sm font-medium text-brand-700">Featured · {postCategories.find((c) => c.key === post.category)?.name}</p>
        <h2 className="mt-3 font-display text-display-md font-semibold text-ink">
          <Link href={`/blog/${post.slug}/`} className="after:absolute after:inset-0">{post.title}</Link>
        </h2>
        <p className="mt-4 leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-6 text-sm text-muted">{post.readingMinutes} min read</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts, headingLevel = 3 }: { posts: Post[]; headingLevel?: 2 | 3 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
