import Image from "next/image";
import Link from "next/link";
import { divisions, getPostsBySlugs, readJson } from "@/lib/content";
import { getImage } from "@/lib/images";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { serviceWhatsappMessage, site, telHref, whatsappHref } from "@/lib/site";
import { LinkButton } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { CtaBand, FaqList, ImageCard, JsonLd, PostCard } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Cleaning, Pest Control, Moving & Logistics in Nairobi | Cleantique",
  description:
    "Professional cleaning, fumigation and pest control, house and office moving, and goods transport for homes and businesses in Nairobi. Get a free quote.",
  path: "/",
  image: "technician-applying-indoor-pest-treatment",
});

type FaqGroup = { group: string; items: { q: string; a: string; home?: boolean }[] };
type Review = { name: string; area: string; service: string; text: string };

const audiences: { icon: IconName; title: string; text: string }[] = [
  { icon: "home", title: "Homeowners and tenants", text: "A deep clean before moving in, bed bugs after a trip, a house move at month end. Practical help without having to find four different companies." },
  { icon: "building", title: "Offices and organisations", text: "Office cleaning outside working hours, pest control that does not disrupt staff, and office moves planned around your reopening." },
  { icon: "key", title: "Landlords and property managers", text: "Units turned around between tenants: move-out cleans, pre-letting fumigation and reliable access arrangements when you cannot be on site." },
  { icon: "utensils", title: "Restaurants and hospitality", text: "Cockroach and rodent control scheduled outside service hours, with bait placed away from food areas, plus cleaning for guest-facing spaces." },
  { icon: "hardhat", title: "Contractors and developers", text: "Post-construction cleans timed to your handover date, with dust and residue removed in stages and finishes protected." },
  { icon: "store", title: "Retailers and businesses", text: "Stock deliveries and distribution runs, store-room pest control and scheduled cleaning for shops and showrooms." },
];

const reasons = [
  { title: "Clear communication", text: "You know what we will do, what we will use and when we will arrive. Pest treatments come with the product name and re-entry time in writing." },
  { title: "Planned for the specific job", text: "We inspect, survey or ask for photos before quoting, so the method, crew and vehicle fit your property rather than a standard package." },
  { title: "Easy to book", text: "Request a quote online, send a WhatsApp message with a photo, or call. One request can cover several services." },
  { title: "Practical guidance", text: "Preparation checklists before the visit and aftercare advice afterwards, because what you do before and after affects the result." },
  { title: "Organised delivery", text: "Written checklists for cleaning, boxes labelled by room for moves, and follow-up visits built into pest control quotes." },
  { title: "Four services, one team", text: "Move, clean and fumigate with one plan and one contact, instead of coordinating separate companies and handing over keys three times." },
];

const steps = [
  { title: "Tell us what you need", text: "Use the quote form, WhatsApp or a call. Share your location, the property type and size, and photos if you can." },
  { title: "Receive an assessment and quote", text: "We inspect, survey or review your photos, then send a written quote that sets out exactly what is included." },
  { title: "Schedule your service", text: "Pick a date that suits you. We send preparation guidance so that the day runs smoothly." },
  { title: "Service delivery and follow-up", text: "The team does the work, checks it with you, and follows up. Pest control includes a follow-up visit where the pest needs one." },
];

const processByDivision = [
  { key: "pest-control", label: "Pest control", text: "Inspection to identify the pest and its source, a treatment plan with the product named, re-entry time in writing, and a follow-up visit for bed bugs and cockroaches." },
  { key: "cleaning", label: "Cleaning", text: "Photos or a site visit, a room-by-room checklist agreed before we start, a check against the list at the end, and a return to fix anything in scope that was missed." },
  { key: "moving-relocation", label: "Moving", text: "A survey in person or by video, a written price and date, packing materials delivered in advance if you need them, and boxes labelled by destination room." },
  { key: "transport-logistics", label: "Logistics", text: "Details of the goods, weight and route, a vehicle matched to the load, a confirmed collection window, and delivery confirmation." },
];

const featured = [
  { href: "/services/pest-control/bed-bug-control/", image: "bed-bug-on-bedding-close-up", title: "Bed bug control", text: "Two treatments about 10 to 14 days apart, a thorough inspection of beds, frames and furniture, and a preparation checklist so the treatment works first time." },
  { href: "/services/cleaning/residential-cleaning/", image: "steam-cleaning-sofa-upholstery", title: "Residential cleaning", text: "Deep cleans, weekly or fortnightly upkeep and move-out cleans for houses, flats and short-term rentals, against a checklist you see first." },
  { href: "/services/moving-relocation/home-moving/", image: "couple-unpacking-boxes-new-home", title: "Home moving", text: "From a bedsitter to a family house: survey, written quote, furniture protection, dismantling and reassembly, and every box labelled by room." },
  { href: "/services/cleaning/post-construction-cleaning/", image: "cleaner-wiping-wooden-table", title: "Post-construction cleaning", text: "Builders' dust, cement, grout haze, paint and adhesive removed in stages with surface-safe methods, timed to your handover." },
];

export default function HomePage() {
  const faqGroups = readJson<{ groups: FaqGroup[] }>("faqs.json").groups;
  const homeFaqs = faqGroups.flatMap((g) => g.items).filter((f) => f.home);
  const { reviews } = readJson<{ reviews: Review[] }>("reviews.json");
  const posts = getPostsBySlugs([
    "how-to-get-rid-of-bed-bugs-kenya",
    "deep-cleaning-vs-regular-cleaning",
    "house-moving-checklist-nairobi",
    "choose-transport-logistics-company-kenya",
  ]);
  const mosaic = divisions.map((d) => ({ ...d, img: getImage(d.image) }));

  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <div className="container grid items-center gap-10 py-10 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-pill bg-white px-3.5 py-1.5 text-[0.92rem] text-muted ring-1 ring-line">
              <Icon name="pin" className="h-4 w-4 text-brand-700" />
              Nairobi and surrounding areas
            </p>
            <h1 className="mt-6 font-display text-display-xl font-semibold text-ink">
              Pests Out. Spaces Clean. Moves Made Easy.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Need pest control, cleaning, relocation or transport services in Nairobi? Cleantique takes the hassle off your hands with
              professional solutions for homes and businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/request-quote/" size="lg" icon="clipboard">Get a Free Quote</LinkButton>
              <LinkButton href="/services/" size="lg" variant="outline">Explore Our Services</LinkButton>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.97rem]">
              <a href={telHref} data-track="click_call" className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand-700">
                <Icon name="phone" className="h-5 w-5 text-brand-700" /> {site.phoneDisplay}
              </a>
              <a
                href={whatsappHref(serviceWhatsappMessage())}
                data-track="click_whatsapp"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand-700"
              >
                <Icon name="whatsapp" className="h-5 w-5 text-[#1DA851]" /> Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Four-division mosaic */}
          <ul className="grid grid-cols-2 gap-3 sm:gap-4" aria-label="Our four service divisions">
            {mosaic.map((d, i) => (
              <li key={d.key} className={i % 2 === 1 ? "translate-y-6 sm:translate-y-8" : ""}>
                <Link href={d.path} className="group relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-brand-900">
                  <Image
                    src={d.img.src}
                    alt={d.img.alt}
                    fill
                    priority={i < 2}
                    sizes="(min-width:1024px) 24vw, 50vw"
                    className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/20 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                    <span className="font-ui text-[0.95rem] font-semibold leading-tight text-white sm:text-[1.05rem]">{d.name}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sun text-ink">
                      <Icon name={d.icon as IconName} className="h-4 w-4" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Four core services */}
      <section className="container py-16 md:py-24" aria-labelledby="core-services">
        <div className="max-w-3xl">
          <h2 id="core-services" className="font-display text-display-lg font-semibold text-ink">One trusted partner. Four essential services.</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Whether you are maintaining a property, dealing with unwanted pests, planning a move or managing deliveries, Cleantique
            brings the services you need together in one place.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {divisions.map((d) => (
            <ImageCard key={d.key} href={d.path} image={d.image} title={d.name} text={d.card} icon={d.icon as IconName} cta={`Explore ${d.navName.toLowerCase()}`} />
          ))}
        </div>
      </section>

      {/* Who we serve */}
      <section className="border-y border-line bg-white" aria-labelledby="who-we-serve">
        <div className="container py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <h2 id="who-we-serve" className="font-display text-display-lg font-semibold text-ink">Solutions for homes, businesses and properties</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Different clients need different things from the same service. Here is how we usually help.
              </p>
            </div>
            <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {audiences.map((a) => (
                <li key={a.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-ui text-[1.08rem] font-semibold text-ink">{a.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-muted">{a.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Specialised services index */}
      <section className="bg-paper" aria-labelledby="specialised">
        <div className="container py-16 md:py-20">
          <h2 id="specialised" className="font-display text-display-lg font-semibold text-ink">Explore our specialised services</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">Go straight to the service you need for scope, preparation advice, pricing factors and FAQs.</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {divisions.map((d) => (
              <div key={d.key} className="rounded-card bg-white p-6 ring-1 ring-line">
                <Link href={d.path} className="flex items-center gap-3 font-ui text-[1.05rem] font-semibold text-ink hover:text-brand-700">
                  <Icon name={d.icon as IconName} className="h-5 w-5 text-brand-700" />
                  {d.name}
                </Link>
                <ul className="mt-4 divide-y divide-line">
                  {d.children.map((c) => (
                    <li key={c.path}>
                      <Link href={c.path} className="group flex items-center justify-between gap-3 py-3 text-ink-soft hover:text-brand-700">
                        {c.name}
                        <Icon name="arrow" className="h-4 w-4 text-brand-700 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="container py-16 md:py-24" aria-labelledby="why-us">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32">
            <h2 id="why-us" className="font-display text-display-lg font-semibold text-ink">Why choose Cleantique?</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              No claims about being the biggest or the best. These are the working habits our clients can hold us to.
            </p>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[18px] bg-paper">
              <Image src={getImage("fumigation-technician-protective-suit").src} alt={getImage("fumigation-technician-protective-suit").alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-card bg-line ring-1 ring-line sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="bg-white p-6 sm:p-7">
                <dt className="flex items-center gap-3 font-ui text-[1.08rem] font-semibold text-ink">
                  <Icon name="check" className="h-5 w-5 text-brand-700" strokeWidth={2.4} />
                  {r.title}
                </dt>
                <dd className="mt-2 leading-relaxed text-muted">{r.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-900 text-white" aria-labelledby="how-it-works">
        <div className="container py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="how-it-works" className="font-display text-display-lg font-semibold">How it works</h2>
            <Link href="/our-process/" className="font-ui font-semibold text-brand-200 hover:text-white">Read about our process in detail</Link>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-white/20 pt-6">
                <span className="font-display text-4xl font-semibold text-sun" aria-hidden="true">{i + 1}</span>
                <h3 className="mt-3 font-ui text-[1.15rem] font-semibold text-white">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 rounded-card bg-white/5 p-6 ring-1 ring-white/10 sm:p-8">
            <h3 className="font-ui text-[1.1rem] font-semibold text-white">What the process looks like for each service</h3>
            <dl className="mt-6 grid gap-6 md:grid-cols-2">
              {processByDivision.map((p) => (
                <div key={p.key}>
                  <dt className="font-ui font-semibold text-brand-200">{p.label}</dt>
                  <dd className="mt-1.5 leading-relaxed text-white/80">{p.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="container py-16 md:py-24" aria-labelledby="featured">
        <h2 id="featured" className="font-display text-display-lg font-semibold text-ink">Popular services</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featured.map((f) => {
            const img = getImage(f.image);
            return (
              <Link key={f.href} href={f.href} className="group grid overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-brand-300 sm:grid-cols-[0.9fr_1fr]">
                <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-[220px]">
                  <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 25vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-col p-6">
                  <h3 className="font-ui text-[1.2rem] font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{f.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-ui text-[0.95rem] font-semibold text-brand-700">
                    View service <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Service areas */}
      <section className="bg-brand-100" aria-labelledby="areas">
        <div className="container grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="areas" className="font-display text-display-lg font-semibold text-ink">Areas we serve</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Nairobi is our main area, from the estates of the Eastlands to the leafy suburbs of the west, along with the towns
              growing around the city. If your area is not listed, ask us.
            </p>
            <a href={site.mapsUrl} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 font-ui font-semibold text-brand-800 hover:underline">
              <Icon name="pin" className="h-5 w-5" /> Find us on Google Maps
            </a>
          </div>
          <ul className="flex flex-wrap content-start gap-2.5">
            {site.serviceAreas.map((a) => (
              <li key={a} className="rounded-pill bg-white px-4 py-2 text-[0.97rem] text-ink ring-1 ring-brand-200">{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section className="container py-16 md:py-24" aria-labelledby="reviews">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="reviews" className="font-display text-display-lg font-semibold text-ink">What our clients say</h2>
          <Link href="/reviews/" className="font-ui font-semibold text-brand-700 hover:underline">Read all reviews</Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name} className="flex flex-col rounded-card bg-paper p-7">
              <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-ink">“{r.text}”</blockquote>
              <figcaption className="mt-6 border-t border-line pt-4 text-[0.95rem]">
                <span className="font-ui font-semibold text-ink">{r.name}</span>
                <span className="block text-muted">{r.area}, {r.service.toLowerCase()}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Resources */}
      {posts.length > 0 && (
        <section className="border-t border-line bg-paper" aria-labelledby="resources">
          <div className="container py-16 md:py-24">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 id="resources" className="font-display text-display-lg font-semibold text-ink">Helpful resources</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">Practical guides written to answer the questions our clients ask before they book.</p>
              </div>
              <Link href="/blog/" className="font-ui font-semibold text-brand-700 hover:underline">Visit the blog</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container py-16 md:py-24" aria-labelledby="home-faq">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 id="home-faq" className="font-display text-display-lg font-semibold text-ink">Frequently asked questions</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">Booking, coverage, quotes and preparation. Each service page has its own detailed FAQs.</p>
            <Link href="/faqs/" className="mt-6 inline-flex font-ui font-semibold text-brand-700 hover:underline">See all FAQs</Link>
          </div>
          <FaqList faqs={homeFaqs} />
        </div>
      </section>

      <CtaBand
        title="Need cleaning, pest control, moving or logistics support?"
        text="Tell us what you need, where you are located and when you would like the service. Our team will confirm the details and send you a suitable quote."
      />
    </>
  );
}
