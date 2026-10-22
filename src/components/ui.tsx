import Link from "next/link";
import Image from "next/image";
import { Icon, type IconName } from "./Icon";
import { LinkButton } from "./Button";
import { getImage } from "@/lib/images";
import { breadcrumbSchema, type Crumb } from "@/lib/seo";
import { serviceWhatsappMessage, whatsappHref, telHref, site } from "@/lib/site";
import type { Post } from "@/lib/content";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.9rem]">
        <ol className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${tone === "light" ? "text-white/75" : "text-muted"}`}>
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "light" ? "text-white" : "text-ink"}>{c.name}</span>
              ) : (
                <Link href={c.path} className="underline-offset-4 hover:underline">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}

export function SectionHeading({
  title,
  intro,
  as: As = "h2",
  className = "",
  id,
}: {
  title: string;
  intro?: React.ReactNode;
  as?: "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <As id={id} className="font-display text-display-lg font-semibold text-ink">{title}</As>
      {intro && <div className="mt-4 text-lg leading-relaxed text-muted">{intro}</div>}
    </div>
  );
}

export function FaqList({ faqs, headingLevel = 3 }: { faqs: { q: string; a: string }[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {faqs.map((f) => (
        <details key={f.q} className="group px-5 py-1 sm:px-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
            <H className="font-ui text-[1.05rem] font-medium leading-snug text-ink">{f.q}</H>
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-brand-700 transition-transform group-open:rotate-180">
              <Icon name="chevron" className="h-4 w-4" />
            </span>
          </summary>
          <div className="pb-5 pr-10 leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: f.a }} />
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  text,
  service,
  quoteHref = "/request-quote/",
}: {
  title: string;
  text: string;
  service?: string;
  quoteHref?: string;
}) {
  return (
    <section className="bg-brand-900 text-white">
      <div className="container grid items-center gap-8 py-16 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
        <div>
          <h2 className="font-display text-display-lg font-semibold">{title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{text}</p>
        </div>
        <div className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton href={quoteHref} size="lg" icon="clipboard">Request a Quote</LinkButton>
            <LinkButton href={whatsappHref(serviceWhatsappMessage(service))} variant="light" size="lg" icon="whatsapp" trackEvent="click_whatsapp">
              Chat on WhatsApp
            </LinkButton>
          </div>
          <a href={telHref} className="inline-flex items-center gap-2 whitespace-nowrap font-ui text-white/85 underline-offset-4 hover:text-white hover:underline" data-track="click_call">
            <Icon name="phone" className="h-4 w-4 shrink-0" /> Or call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ImageCard({
  href,
  image,
  title,
  text,
  icon,
  cta = "Learn more",
  headingLevel = 3,
  priority,
}: {
  href: string;
  image: string;
  title: string;
  text: string;
  icon?: IconName;
  cta?: string;
  headingLevel?: 2 | 3;
  priority?: boolean;
}) {
  const img = getImage(image);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand-300">
      <div className="relative aspect-[3/2] overflow-hidden bg-paper">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" priority={priority} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <Icon name={icon} className="h-5 w-5" />
            </span>
          )}
          <H className="font-ui text-[1.15rem] font-semibold leading-snug text-ink">{title}</H>
        </div>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{text}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-ui text-[0.95rem] font-semibold text-brand-700">
          {cta}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

const categoryNames: Record<string, string> = {
  "pest-control": "Pest Control",
  cleaning: "Cleaning",
  "moving-relocation": "Moving & Relocation",
  "transport-logistics": "Transport & Logistics",
};

export function PostCard({ post, headingLevel = 3 }: { post: Post; headingLevel?: 2 | 3 }) {
  const img = getImage(post.image);
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-ui text-sm font-medium text-brand-700">{categoryNames[post.category]}</p>
        <H className="mt-2 font-ui text-[1.12rem] font-semibold leading-snug text-ink">
          <Link href={`/blog/${post.slug}/`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </H>
        <div className="mt-3 flex-1">
          <p className="line-clamp-3 leading-relaxed text-muted">{post.excerpt}</p>
        </div>
        <p className="mt-5 text-sm text-muted">{post.readingMinutes} min read</p>
      </div>
    </article>
  );
}

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Toc({ items, title = "On this page" }: { items: { id: string; text: string; level: number }[]; title?: string }) {
  const h2s = items.filter((i) => i.level === 2);
  if (h2s.length < 3) return null;
  return (
    <nav aria-label={title} className="rounded-card border border-line bg-white p-5">
      <p className="font-ui text-sm font-semibold text-ink">{title}</p>
      <ol className="mt-3 space-y-2 text-[0.93rem]">
        {h2s.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="block leading-snug text-muted hover:text-brand-700">{i.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-ct ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
