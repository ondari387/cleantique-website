import { getAllLocations } from "@/lib/content";
import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { CtaBand, ImageCard } from "@/components/ui";

export const metadata = buildMetadata({
  title: "Areas We Serve in Nairobi | Cleantique",
  description:
    "Cleaning, pest control, moving and goods transport across Nairobi and nearby towns, including Westlands, Kilimani, Lavington, Karen, Syokimau and Ruaka.",
  path: "/locations/",
  image: "movers-loading-boxes-into-truck",
});

export default function LocationsPage() {
  const locations = getAllLocations();
  const covered = new Set(locations.map((l) => l.name));
  const otherAreas = site.serviceAreas.filter((a) => !covered.has(a));

  return (
    <>
      <PageHero
        crumbs={[{ name: "Areas we serve", path: "/locations/" }]}
        title="Areas We Serve in Nairobi"
        lede="Cleaning, pest control, moving and goods transport for homes and businesses across Nairobi and nearby towns. Pick your area below for what we see most often there, or ask us about anywhere not listed."
      />

      <div className="container py-14 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <ImageCard key={l.slug} href={`/locations/${l.slug}/`} image={l.image} title={l.name} text={l.description} icon="pin" />
          ))}
        </div>

        {otherAreas.length > 0 && (
          <div className="mt-16 rounded-card border border-line bg-paper p-6 md:p-8">
            <p className="font-ui font-semibold text-ink">Also serving</p>
            <p className="mt-3 leading-relaxed text-muted">
              {otherAreas.join(", ")} and nearby. If your area isn't listed above, message us on WhatsApp or use the quote form
              and we'll confirm whether we cover it.
            </p>
          </div>
        )}
      </div>

      <CtaBand
        title="Tell us your area and the service you need"
        text="We'll confirm the details and send a written quote before any work starts."
      />
    </>
  );
}
