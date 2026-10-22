import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getAllServices, getPost, getRelatedPosts, postCategories } from "@/lib/content";
import { getImage } from "@/lib/images";
import { articleSchema, buildMetadata } from "@/lib/seo";
import { serviceWhatsappMessage, whatsappHref } from "@/lib/site";
import { LinkButton } from "@/components/Button";
import { Breadcrumbs, CtaBand, ImageCard, JsonLd, PostCard, Prose, Toc } from "@/components/ui";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return buildMetadata({
    title: p.seoTitle,
    description: p.description,
    path: `/blog/${p.slug}/`,
    image: p.image,
    type: "article",
    publishedTime: p.date,
    modifiedTime: p.updated,
  });
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const cat = postCategories.find((c) => c.key === post.category)!;
  const img = getImage(post.image);
  const related = getRelatedPosts(post, 3);
  const services = post.services.map((s) => getAllServices().find((x) => x.path === s)).filter(Boolean) as ReturnType<typeof getAllServices>;
  const primary = services[0];

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}/`,
          image: post.image,
          date: post.date,
          updated: post.updated,
          author: post.author,
        })}
      />
      <article>
        <header className="border-b border-line bg-paper">
          <div className="container py-10 md:py-14">
            <Breadcrumbs
              items={[
                { name: "Blog", path: "/blog/" },
                { name: cat.name, path: `/blog/category/${cat.key}/` },
                { name: post.title, path: `/blog/${post.slug}/` },
              ]}
            />
            <div className="mt-8 max-w-4xl">
              <Link href={`/blog/category/${cat.key}/`} className="font-ui text-[0.95rem] font-medium text-brand-700 hover:underline">{cat.name}</Link>
              <h1 className="mt-3 font-display text-display-lg font-semibold text-ink">{post.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">{post.excerpt}</p>
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem] text-muted">
                <span>By {post.author}</span>
                <span>
                  {post.updated !== post.date ? "Updated " : "Published "}
                  <time dateTime={post.updated}>{fmt(post.updated)}</time>
                </span>
                <span>{post.readingMinutes} min read</span>
              </p>
            </div>
          </div>
        </header>

        <div className="container pt-10">
          <div className="relative aspect-[21/9] overflow-hidden rounded-[20px] bg-paper">
            <Image src={img.src} alt={img.alt} fill priority sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="container grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div>
            <Prose html={post.html} />
            <div className="mt-12 max-w-prose rounded-card border border-line bg-paper p-6">
              <p className="font-ui font-semibold text-ink">About this guide</p>
              <p className="mt-2 text-[0.97rem] leading-relaxed text-muted">
                Written by the {post.author} team for homes and businesses in Nairobi. It is general guidance, not a substitute for an
                inspection or professional advice about your specific property. If anything here is unclear or out of date, tell us at{" "}
                <a href="mailto:hi@cleantique.co.ke" className="text-brand-700 underline">hi@cleantique.co.ke</a>.
              </p>
            </div>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
            <Toc items={post.toc} title="In this article" />
            {primary && (
              <div className="rounded-card bg-brand-900 p-6 text-white">
                <p className="font-ui text-lg font-semibold">Need {primary.title.toLowerCase()}?</p>
                <p className="mt-2 text-[0.97rem] leading-relaxed text-white/80">{primary.description}</p>
                <div className="mt-5 grid gap-2">
                  <LinkButton href={primary.path}>View the service</LinkButton>
                  <LinkButton href={whatsappHref(serviceWhatsappMessage(primary.whatsapp))} variant="light" icon="whatsapp" trackEvent="click_whatsapp">
                    WhatsApp us
                  </LinkButton>
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>

      {services.length > 0 && (
        <section className="border-t border-line bg-paper py-14" aria-labelledby="post-services">
          <div className="container">
            <h2 id="post-services" className="font-display text-display-md font-semibold text-ink">Related services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 3).map((s) => (
                <ImageCard key={s.path} href={s.path} image={s.image} title={s.title} text={s.description} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container py-14" aria-labelledby="related-posts">
          <h2 id="related-posts" className="font-display text-display-md font-semibold text-ink">Keep reading</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      )}

      <CtaBand
        title={primary ? `Get a quote for ${primary.title.toLowerCase()}` : "Get a free quote"}
        text="Tell us what you need, where you are and when. We will confirm the details and send a written quote."
        service={primary?.whatsapp}
        quoteHref={primary ? `/request-quote/?service=${primary.division}${primary.kind === "child" ? `&type=${primary.slug}` : ""}` : "/request-quote/"}
      />
    </>
  );
}
