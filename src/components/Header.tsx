"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import divisions from "@content/divisions.json";
import { Icon, type IconName } from "./Icon";
import { Logo } from "./Logo";
import { site, telHref, whatsappHref, serviceWhatsappMessage } from "@/lib/site";

const nav = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about/" },
  { name: "Services", href: "/services/", mega: true },
  { name: "Blog", href: "/blog/" },
  { name: "Contact", href: "/contact/" },
];

export function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAt = useRef(0);

  // Close menus on navigation.
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes; click outside closes the mega menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (megaOpen) {
          setMegaOpen(false);
          triggerRef.current?.focus();
        }
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaOpen && megaRef.current && !megaRef.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen((open) => {
      if (!open) hoverOpenedAt.current = Date.now();
      return true;
    });
  };
  // A click right after hover-open should keep the menu open, not toggle it shut.
  const onTriggerClick = () => {
    if (Date.now() - hoverOpenedAt.current < 600) return setMegaOpen(true);
    setMegaOpen((v) => !v);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-brand-900 text-[0.85rem] text-white/90 md:block">
        <div className="container flex h-9 items-center justify-between gap-6">
          <p className="flex items-center gap-2">
            <Icon name="pin" className="h-4 w-4 text-brand-300" />
            Free quotes by phone, WhatsApp or online
          </p>
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-2">
              <Icon name="clock" className="h-4 w-4 text-brand-300" />
              Mon–Fri 9am–6pm, Sat–Sun 9am–4pm
            </p>
            <a href={telHref} data-track="click_call" className="flex items-center gap-2 hover:text-white">
              <Icon name="phone" className="h-4 w-4 text-brand-300" />
              {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className={`border-b bg-white/95 backdrop-blur transition-shadow ${scrolled ? "border-line shadow-[0_6px_20px_-14px_rgba(22,26,20,.35)]" : "border-transparent"}`}>
        <div className="container flex h-[68px] items-center justify-between gap-4">
          <Logo className="h-10 w-auto md:h-11" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) =>
                item.mega ? (
                  <li key={item.name} onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                    <button
                      ref={triggerRef}
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu"
                      onClick={onTriggerClick}
                      className={`flex items-center gap-1 rounded-pill px-4 py-2 font-ui text-[0.97rem] font-medium transition-colors hover:bg-paper ${
                        isActive("/services/") ? "text-brand-700" : "text-ink"
                      }`}
                    >
                      Services
                      <Icon name="chevron" className={`h-4 w-4 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                    </button>
                  </li>
                ) : (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`rounded-pill px-4 py-2 font-ui text-[0.97rem] font-medium transition-colors hover:bg-paper ${
                        isActive(item.href) ? "text-brand-700" : "text-ink"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={whatsappHref(serviceWhatsappMessage())}
              data-track="click_whatsapp"
              target="_blank"
              rel="noopener"
              className="hidden items-center gap-2 rounded-pill border border-ink/15 px-4 py-2 font-ui text-[0.92rem] font-medium text-ink hover:border-[#25D366] sm:inline-flex"
            >
              <Icon name="whatsapp" className="h-5 w-5 text-[#1DA851]" />
              WhatsApp
            </a>
            <Link
              href="/request-quote/"
              className="hidden rounded-pill bg-sun px-5 py-2.5 font-ui text-[0.95rem] font-semibold text-ink hover:bg-sun-600 sm:inline-flex"
            >
              Get a Quote
            </Link>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-ink/15 lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        <div
          id="mega-menu"
          ref={megaRef}
          onMouseEnter={openMega}
          onMouseLeave={scheduleClose}
          hidden={!megaOpen}
          className="absolute inset-x-0 top-full border-b border-line bg-white shadow-lift"
        >
          {megaOpen && (
            <div className="container py-8">
              <div className="grid grid-cols-4 gap-8">
                {divisions.map((d) => (
                  <div key={d.key}>
                    <Link href={d.path} className="group flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                        <Icon name={d.icon as IconName} className="h-5 w-5" />
                      </span>
                      <span className="font-ui text-[1.02rem] font-semibold text-ink group-hover:text-brand-700">{d.name}</span>
                    </Link>
                    <ul className="mt-4 space-y-1 border-l border-line pl-4">
                      {d.children.map((c) => (
                        <li key={c.path}>
                          <Link href={c.path} className="block py-1.5 text-[0.97rem] text-muted hover:text-brand-700">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-card bg-paper px-5 py-4">
                <p className="text-[0.97rem] text-muted">
                  Need more than one service, such as a move followed by a clean and fumigation? Tell us everything in one request.
                </p>
                <div className="flex gap-5 font-ui text-[0.95rem] font-semibold">
                  <Link href="/services/" className="text-brand-700 hover:underline">All services</Link>
                  <Link href="/our-process/" className="text-brand-700 hover:underline">How we work</Link>
                  <Link href="/request-quote/" className="text-brand-700 hover:underline">Request a quote</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="fixed inset-x-0 bottom-0 top-[68px] z-40 md:top-[104px] overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="container pb-28 pt-4">
          <ul className="divide-y divide-line">
            {nav.map((item) =>
              item.mega ? (
                <li key={item.name} className="py-1">
                  <Link href="/services/" className="block py-3 font-ui text-lg font-semibold text-ink">
                    All services
                  </Link>
                  <ul className="space-y-1 pb-2">
                    {divisions.map((d) => {
                      const open = mobileSection === d.key;
                      return (
                        <li key={d.key} className="rounded-card bg-paper">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-ui font-medium text-ink"
                            aria-expanded={open}
                            onClick={() => setMobileSection(open ? null : d.key)}
                          >
                            <span className="flex items-center gap-3">
                              <Icon name={d.icon as IconName} className="h-5 w-5 text-brand-700" />
                              {d.name}
                            </span>
                            <Icon name="chevron" className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
                          </button>
                          {open && (
                            <ul className="px-4 pb-3">
                              <li>
                                <Link href={d.path} className="block py-2 font-medium text-brand-700">
                                  {d.name} overview
                                </Link>
                              </li>
                              {d.children.map((c) => (
                                <li key={c.path}>
                                  <Link href={c.path} className="block py-2 text-muted">
                                    {c.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ) : (
                <li key={item.name}>
                  <Link href={item.href} className="block py-3 font-ui text-lg font-semibold text-ink">
                    {item.name}
                  </Link>
                </li>
              ),
            )}
            <li>
              <Link href="/faqs/" className="block py-3 font-ui text-lg font-semibold text-ink">FAQs</Link>
            </li>
          </ul>
          <div className="mt-6 grid gap-3">
            <Link href="/request-quote/" className="rounded-pill bg-sun px-5 py-3.5 text-center font-ui font-semibold text-ink">
              Get a Free Quote
            </Link>
            <a href={telHref} data-track="click_call" className="rounded-pill border border-ink/15 px-5 py-3.5 text-center font-ui font-semibold text-ink">
              Call {site.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
