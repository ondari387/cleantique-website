import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

const page = getPage("terms-of-service");
export const metadata = buildMetadata({ title: page.seoTitle, description: page.description, path: "/terms-of-service/" });

export default function TermsPage() {
  return <LegalPage slug="terms-of-service" path="/terms-of-service/" />;
}
