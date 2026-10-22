import Link from "next/link";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";

const styles: Record<Variant, string> = {
  // Brand yellow with ink text: 12.2:1 contrast.
  primary: "bg-sun text-ink hover:bg-sun-600 border border-sun-600/40",
  // Deep brand green with white text: 5.8:1 contrast.
  secondary: "bg-brand-700 text-white hover:bg-brand-800 border border-brand-800",
  outline: "bg-white text-ink border border-ink/20 hover:border-ink/50",
  ghost: "text-brand-700 hover:text-brand-800 underline-offset-4 hover:underline px-0",
  whatsapp: "bg-white text-ink border border-ink/15 hover:border-[#25D366] hover:text-ink",
  light: "bg-white/10 text-white border border-white/30 hover:bg-white/20",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  external?: boolean;
  size?: "md" | "lg";
  trackEvent?: string;
  ariaLabel?: string;
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  icon,
  iconRight,
  className = "",
  external,
  size = "md",
  trackEvent,
  ariaLabel,
}: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-ui font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 ${
    size === "lg" ? "px-6 py-3.5 text-[1.02rem]" : "px-5 py-2.5 text-[0.95rem]"
  } ${styles[variant]} ${className}`;
  const inner = (
    <>
      {icon && <Icon name={icon} className={variant === "whatsapp" ? "h-5 w-5 shrink-0 text-[#1DA851]" : "h-5 w-5 shrink-0"} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} className="h-4 w-4 shrink-0" />}
    </>
  );
  const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        data-track={trackEvent}
        aria-label={ariaLabel}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} data-track={trackEvent} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}
