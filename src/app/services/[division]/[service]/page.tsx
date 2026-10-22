import { notFound } from "next/navigation";
import { getAllServices, getService } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/ServiceTemplate";

type Params = { division: string; service: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllServices()
    .filter((s) => s.kind === "child")
    .map((s) => ({ division: s.division, service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { division, service } = await params;
  const s = getService(`/services/${division}/${service}/`);
  if (!s) return {};
  return buildMetadata({ title: s.seoTitle, description: s.description, path: s.path, image: s.image });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { division, service } = await params;
  const s = getService(`/services/${division}/${service}/`);
  if (!s) notFound();
  return <ServiceTemplate service={s} />;
}
