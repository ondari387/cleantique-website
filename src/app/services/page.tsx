import Link from "next/link";
import Image from "next/image";
import { divisions, getService } from "@/lib/content";
import { getImage } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Icon, type IconName } from "@/components/Icon";
import { CtaBand } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Our Services | Cleaning, Pest Control, Moving & Logistics | Cleantique",
  description:
    "Fumigation and pest control, home, office and post-construction cleaning, house and office moving, and goods transport in Nairobi, all in one place.",
  path: "/services/",
  image: "cleaner-scrubbing-kitchen-counter",
});

const combos = [
  {
    title: "Moving house",
    text: "Move-out clean of the old property, bed bug or cockroach treatment of the new one before furniture arrives, then the move itself.",
    links: [
      { name: "Home moving", href: "/services/moving-relocation/home-moving/" },
      { name: "Residential cleaning", href: "/services/cleaning/residential-cleaning/" },
      { name: "Pest control", href: "/services/pest-control/" },
    ],
  },
  {
    title: "Turning over a rental unit",
    text: "A pre-letting fumigation followed by a deep clean of the empty unit, timed so the treatment is not wiped away.",
    links: [
      { name: "Cockroach control", href: "/services/pest-control/cockroach-control/" },
      { name: "Residential cleaning", href: "/services/cleaning/residential-cleaning/" },
    ],
  },
  {
    title: "Relocating an office",
    text: "A planned out-of-hours move, a handover clean of the old premises, a pre-occupation clean of the new office, and goods runs for stock or files.",
    links: [
      { name: "Office relocation", href: "/services/moving-relocation/office-relocation/" },
      { name: "Office cleaning", href: "/services/cleaning/office-cleaning/" },
      { name: "Transport & logistics", href: "/services/transport-logistics/" },
    ],
  },
  {
    title: "Finishing a build or renovation",
    text: "A staged post-construction clean before handover, then pest proofing and treatment before the new occupants move in.",
    links: [
      { name: "Post-construction cleaning", href: "/services/cleaning/post-construction-cleaning/" },
      { name: "Rodent control", href: "/services/pest-control/rodent-control/" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services/" }]}
        title="Cleaning, Pest Control, Moving and Logistics Services"
        lede={
          <p>
            Four essential property and business services, each planned properly and quoted in writing. Choose a service below
            for scope, preparation advice, pricing factors and FAQs, or tell us about a job that needs more than one.
          </p>
        }
      />

      <div className="container space-y-16 py-14 md:space-y-20 md:py-20">
        {divisions.map((d, i) => {
          const parent = getService(d.path);
          const img = getImage(d.image);
          return (
            <section key={d.key} aria-labelledby={`div-${d.key}`} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={`relative aspect-[4/3] overflow-hidden rounded-[20px] bg-paper ${i % 2 ? "lg:order-2" : ""}`}>
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <div>
                <p className="flex items-center gap-2 font-ui font-medium text-brand-700">
                  <Icon name={d.icon as IconName} className="h-5 w-5" />
                  {d.children.length > 0 && d.key !== "transport-logistics" ? `${d.children.length} services` : "Goods transport and delivery"}
                </p>
                <h2 id={`div-${d.key}`} className="mt-2 font-display text-display-md font-semibold text-ink">
                  <Link href={d.path} className="hover:text-brand-700">{d.name}</Link>
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{parent?.lede ?? d.card}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {d.children.map((c) => (
                    <li key={c.path}>
                      <Link href={c.path} className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3 text-ink hover:border-brand-300 hover:text-brand-700">
                        {c.name}
                        <Icon name="arrow" className="h-4 w-4 text-brand-700 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href={d.path} className="mt-6 inline-flex items-center gap-2 font-ui font-semibold text-brand-700 hover:underline">
                  {d.name} overview <Icon name="arrow" className="h-4 w-4" />
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-line bg-paper" aria-labelledby="combined">
        <div className="container py-16 md:py-20">
          <h2 id="combined" className="font-display text-display-lg font-semibold text-ink">Jobs that need more than one service</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            These are the combinations we plan most often. Booking them together means one plan, one contact and the right order of work.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {combos.map((c) => (
              <div key={c.title} className="rounded-card bg-white p-7 ring-1 ring-line">
                <h3 className="font-ui text-[1.15rem] font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{c.text}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block rounded-pill bg-brand-100 px-3.5 py-1.5 text-[0.92rem] font-medium text-brand-800 hover:bg-brand-200">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which service you need?"
        text="Describe the problem or the job in a sentence or two, add a photo if you can, and we will tell you what it needs and what it will cost."
      />
    </>
  );
}
