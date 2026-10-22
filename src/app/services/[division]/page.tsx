import { notFound } from "next/navigation";
import { getAllServices, getService } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { ServiceTemplate } from "@/components/ServiceTemplate";

type Params = { division: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllServices()
    .filter((s) => s.kind === "parent")
    .map((s) => ({ division: s.division }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { division } = await params;
  const s = getService(`/services/${division}/`);
  if (!s) return {};
  return buildMetadata({ title: s.seoTitle, description: s.description, path: s.path, image: s.image });
}

export default async function DivisionPage({ params }: { params: Promise<Params> }) {
  const { division } = await params;
  const s = getService(`/services/${division}/`);
  if (!s) notFound();
  return <ServiceTemplate service={s} />;
}
