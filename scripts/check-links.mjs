#!/usr/bin/env node
/**
 * Crawls a running copy of the site and reports broken links, missing metadata
 * and pages without exactly one H1.
 *   npm run build && npm start   (in one terminal)
 *   BASE=http://localhost:3000 npm run check:links   (in another)
 */
const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");

const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => r.text());
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const checked = new Map();
const problems = [];

async function status(p) {
  if (checked.has(p)) return checked.get(p);
  const r = await fetch(BASE + p, { redirect: "manual" });
  checked.set(p, r.status);
  return r.status;
}

for (const p of urls) {
  const res = await fetch(BASE + p);
  const html = await res.text();
  if (res.status !== 200) problems.push(`${p}: status ${res.status}`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${p}: ${h1s} H1 elements`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${p}: missing <title>`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) problems.push(`${p}: missing meta description`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${p}: missing canonical`);
  const imgsNoAlt = [...html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)].length;
  if (imgsNoAlt) problems.push(`${p}: ${imgsNoAlt} <img> without alt`);
  const links = new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]).filter((l) => !l.startsWith("/_next")));
  for (const l of links) {
    const s = await status(l);
    if (s >= 400) problems.push(`${p}: broken link ${l} (${s})`);
  }
}

console.log(`Crawled ${urls.length} pages, checked ${checked.size} unique links.`);
problems.forEach((p) => console.log("ERROR", p));
process.exit(problems.length ? 1 : 0);
