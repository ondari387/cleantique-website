import Link from "next/link";

/** Original Cleantique wordmark (SVG extracted unchanged from cleantique.co.ke). */
export function Logo({ className = "h-9 w-auto", linked = true }: { className?: string; linked?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src="/brand/cleantique-logo-green.svg" alt="Cleantique Solutions" width={140} height={40} className={className} />;
  if (!linked) return img;
  return (
    <Link href="/" className="inline-flex shrink-0 items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700" aria-label="Cleantique Solutions home">
      {img}
    </Link>
  );
}
