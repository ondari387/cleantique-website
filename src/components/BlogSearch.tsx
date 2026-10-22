"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "./Icon";

type Item = { slug: string; title: string; excerpt: string; category: string; categoryName: string; keywords: string };

export function BlogSearch({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    return items
      .map((it) => {
        const hay = `${it.title} ${it.excerpt} ${it.categoryName} ${it.keywords}`.toLowerCase();
        const score = terms.reduce((s, t) => s + (hay.includes(t) ? (it.title.toLowerCase().includes(t) ? 3 : 1) : 0), 0);
        return { it, score, all: terms.every((t) => hay.includes(t)) };
      })
      .filter((r) => r.all)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.it);
  }, [q, items]);

  return (
    <div role="search" className="relative max-w-xl">
      <label htmlFor="blog-search" className="sr-only">Search articles</label>
      <div className="flex items-center gap-3 rounded-pill border border-ink/15 bg-white px-5 py-3 focus-within:ring-2 focus-within:ring-brand-700">
        <Icon name="search" className="h-5 w-5 text-muted" />
        <input
          id="blog-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles, e.g. bed bugs, moving checklist"
          className="w-full bg-transparent text-[1rem] text-ink placeholder:text-muted/80 focus:outline-none"
          autoComplete="off"
        />
      </div>
      <div aria-live="polite" className="sr-only">
        {q.trim().length > 1 ? `${results.length} article${results.length === 1 ? "" : "s"} found` : ""}
      </div>
      {q.trim().length > 1 && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-card border border-line bg-white shadow-lift">
          {results.length ? (
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}/`} className="block px-5 py-3 hover:bg-paper">
                    <span className="block font-ui text-sm text-brand-700">{r.categoryName}</span>
                    <span className="block font-medium text-ink">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-muted">
              No articles match “{q}”. Try a broader word, or <Link href="/contact/" className="text-brand-700 underline">ask us directly</Link>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
