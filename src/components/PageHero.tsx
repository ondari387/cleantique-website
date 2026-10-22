import Image from "next/image";
import { getImage } from "@/lib/images";
import type { Crumb } from "@/lib/seo";
import { Breadcrumbs } from "./ui";

export function PageHero({
  crumbs,
  title,
  lede,
  image,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  lede?: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
}) {
  const img = image ? getImage(image) : null;
  return (
    <section className="border-b border-line bg-paper">
      <div className={`container grid items-center gap-10 py-10 md:py-14 ${img ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}>
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-8 font-display text-display-lg font-semibold text-ink">{title}</h1>
          {lede && <div className="mt-5 text-lg leading-relaxed text-muted">{lede}</div>}
          {children}
        </div>
        {img && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-white">
            <Image src={img.src} alt={img.alt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
