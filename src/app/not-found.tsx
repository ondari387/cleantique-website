import Link from "next/link";
import divisions from "@content/divisions.json";
import { LinkButton } from "@/components/Button";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="container py-20 md:py-28">
      <p className="font-ui font-medium text-brand-700">Error 404</p>
      <h1 className="mt-3 max-w-2xl font-display text-display-lg font-semibold text-ink">We could not find that page</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        The page may have moved when we updated our website. Choose a service below, search the blog, or contact us and we will point you in the right direction.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href="/" variant="secondary">Go to the homepage</LinkButton>
        <LinkButton href="/contact/" variant="outline">Contact us</LinkButton>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {divisions.map((d) => (
          <li key={d.key}>
            <Link href={d.path} className="block rounded-card border border-line p-5 font-ui font-semibold text-ink hover:border-brand-300 hover:text-brand-700">
              {d.name}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-muted">
        Looking for advice? <Link href="/blog/" className="font-medium text-brand-700 underline">Browse the blog</Link>.
      </p>
    </section>
  );
}
