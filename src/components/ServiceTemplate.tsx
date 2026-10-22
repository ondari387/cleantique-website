import Image from "next/image";
import Link from "next/link";
import { getImage } from "@/lib/images";
import { getAllServices, getDivision, getPostsBySlugs, getServicesForDivision, type ServicePage } from "@/lib/content";
import { faqSchema, serviceSchema } from "@/lib/seo";
import { serviceWhatsappMessage, site, telHref, whatsappHref } from "@/lib/site";
import { LinkButton } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Breadcrumbs, CtaBand, FaqList, ImageCard, JsonLd, PostCard, Prose, Toc } from "./ui";

export function ServiceTemplate({ service }: { service: ServicePage }) {
  const division = getDivision(service.division)!;
  const img = getImage(service.image);
  const children = service.kind === "parent" ? getServicesForDivision(service.division) : [];
  const all = getAllServices();
  const related = service.related.map((p) => all.find((s) => s.path === p)).filter(Boolean) as ServicePage[];
  const posts = getPostsBySlugs(service.posts);
  const quoteHref = `/request-quote/?service=${service.division}${service.kind === "child" ? `&type=${service.slug}` : ""}`;
  const crumbs =
    service.kind === "parent"
      ? [{ name: "Services", path: "/services/" }, { name: division.name, path: service.path }]
      : [
          { name: "Services", path: "/services/" },
          { name: division.name, path: division.path },
          { name: service.title, path: service.path },
        ];

  return (
    <>
      <JsonLd data={serviceSchema({ name: service.h1, description: service.description, path: service.path, serviceType: service.title, image: service.image })} />
      {service.faqs.length > 0 && <JsonLd data={faqSchema(service.faqs)} />}

      {/* Hero */}
      <section className="border-b border-line bg-paper">
        <div className="container grid items-center gap-10 py-10 md:py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div>
            <Breadcrumbs items={crumbs} />
            <p className="mt-8 flex items-center gap-2 font-ui text-[0.95rem] font-medium text-brand-700">
              <Icon name={division.icon as IconName} className="h-5 w-5" />
              {division.name}
            </p>
            <h1 className="mt-3 font-display text-display-lg font-semibold text-ink">{service.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{service.lede}</p>
            {service.highlights.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 rounded-pill border border-brand-200 bg-white px-3.5 py-1.5 text-[0.92rem] text-ink">
                    <Icon name="check" className="h-4 w-4 text-brand-700" strokeWidth={2.3} />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton href={quoteHref} size="lg" icon="clipboard">Get a Free Quote</LinkButton>
              <LinkButton
                href={whatsappHref(serviceWhatsappMessage(service.whatsapp))}
                variant="whatsapp"
                size="lg"
                icon="whatsapp"
                trackEvent="click_whatsapp"
              >
                WhatsApp us
              </LinkButton>
            </div>
            <p className="mt-4 text-[0.95rem] text-muted">
              Prefer to talk?{" "}
              <a href={telHref} data-track="click_call" className="font-medium text-brand-700 underline-offset-4 hover:underline">
                Call {site.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white">
              <Image src={img.src} alt={img.alt} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Sub-services for division pages */}
      {children.length > 0 && (
        <section className="container py-14 md:py-16" aria-labelledby="sub-services">
          <h2 id="sub-services" className="font-display text-display-md font-semibold text-ink">
            {division.key === "pest-control" ? "Choose the pest you are dealing with" : `Our ${division.navName.toLowerCase()} services`}
          </h2>
          <div className={`mt-8 grid gap-6 sm:grid-cols-2 ${children.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
            {children.map((c) => (
              <ImageCard key={c.path} href={c.path} image={c.image} title={c.title} text={c.description} cta={`About ${c.title.toLowerCase()}`} />
            ))}
          </div>
        </section>
      )}

      {/* Body */}
      <section className={`container grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16 ${children.length ? "" : "pt-14 md:pt-16"}`}>
        <article>
          <Prose html={service.html} />

          {service.gallery.length > 0 && (
            <div className="mt-12 grid max-w-prose gap-4 sm:grid-cols-2">
              {service.gallery.map((k) => {
                const g = getImage(k);
                return (
                  <figure key={k} className="relative aspect-[4/3] overflow-hidden rounded-card bg-paper">
                    <Image src={g.src} alt={g.alt} fill sizes="(min-width:640px) 340px, 100vw" className="object-cover" />
                  </figure>
                );
              })}
            </div>
          )}

          {service.faqs.length > 0 && (
            <div className="mt-16 max-w-prose">
              <h2 id="faqs" className="font-display text-display-md font-semibold text-ink">
                Frequently asked questions
              </h2>
              <div className="mt-6">
                <FaqList faqs={service.faqs} />
              </div>
            </div>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:self-start lg:overflow-y-auto lg:pb-2">
          <Toc items={[...service.toc, ...(service.faqs.length ? [{ id: "faqs", text: "Frequently asked questions", level: 2 }] : [])]} />
          <div className="rounded-card bg-brand-900 p-6 text-white">
            <p className="font-ui text-lg font-semibold">Get a quote for {service.title.toLowerCase()}</p>
            <p className="mt-2 text-[0.97rem] leading-relaxed text-white/80">
              Send your location, the property size and a photo if you have one. A clear photo on WhatsApp is usually the fastest route to an accurate price.
            </p>
            <div className="mt-5 grid gap-2">
              <LinkButton href={quoteHref} icon="clipboard">Request a Quote</LinkButton>
              <LinkButton href={whatsappHref(serviceWhatsappMessage(service.whatsapp))} variant="light" icon="whatsapp" trackEvent="click_whatsapp">
                WhatsApp
              </LinkButton>
              <LinkButton href={telHref} variant="light" icon="phone" trackEvent="click_call">
                {site.phoneDisplay}
              </LinkButton>
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper py-14 md:py-16" aria-labelledby="related-services">
          <div className="container">
            <h2 id="related-services" className="font-display text-display-md font-semibold text-ink">Related services</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 3).map((r) => (
                <ImageCard key={r.path} href={r.path} image={r.image} title={r.title} text={r.description} />
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="container py-14 md:py-16" aria-labelledby="related-reading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="related-reading" className="font-display text-display-md font-semibold text-ink">Helpful reading</h2>
            <Link href="/blog/" className="font-ui font-semibold text-brand-700 hover:underline">All articles</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      <CtaBand
        title={`Ready to book ${service.title.toLowerCase()}?`}
        text="Tell us what you need, where the property is and when suits you. We will confirm the scope and send a quote before any work is booked."
        service={service.whatsapp}
        quoteHref={quoteHref}
      />
    </>
  );
}
