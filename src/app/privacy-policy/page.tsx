import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const page = getPage("privacy-policy");
export const metadata = buildMetadata({ title: page.seoTitle, description: page.description, path: "/privacy-policy/" });

export default function PrivacyPage() {
  return <LegalPage slug="privacy-policy" path="/privacy-policy/" />;
}
