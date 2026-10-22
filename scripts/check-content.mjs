#!/usr/bin/env node
/**
 * Content QA: run with `npm run check:content`.
 * Checks frontmatter, SEO title/description lengths, image keys, related links,
 * internal Markdown links and duplicate titles/descriptions.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const list = (d) => fs.readdirSync(path.join(root, d)).filter((f) => f.endsWith(".md")).map((f) => `${d}/${f}`);

const imageKeys = new Set([...read("src/lib/images.ts").matchAll(/^ {2}"([a-z0-9-]+)": img\(/gm)].map((m) => m[1]));
const services = list("content/services").map((f) => ({ f, ...matter(read(f)) }));
const posts = list("content/posts").map((f) => ({ f, ...matter(read(f)) }));
const pages = list("content/pages").map((f) => ({ f, ...matter(read(f)) }));

const servicePaths = new Set(services.map((s) => s.data.path));
const postSlugs = new Set(posts.map((p) => p.data.slug));
const cats = ["pest-control", "cleaning", "moving-relocation", "transport-logistics"];
const valid = new Set([
  ...servicePaths,
  ...[...postSlugs].map((s) => `/blog/${s}/`),
  ...cats.map((c) => `/blog/category/${c}/`),
  "/", "/about/", "/services/", "/contact/", "/blog/", "/faqs/", "/our-process/", "/reviews/", "/request-quote/", "/privacy-policy/", "/terms-of-service/",
]);

const problems = [];
const warn = [];
const seen = { title: new Map(), desc: new Map() };

function checkSeo(f, d) {
  const t = d.seoTitle || d.title;
  if (!t) problems.push(`${f}: missing seoTitle`);
  else if (t.length > 65) warn.push(`${f}: seoTitle is ${t.length} chars`);
  if (!d.description) problems.push(`${f}: missing description`);
  else if (d.description.length > 165) warn.push(`${f}: description is ${d.description.length} chars`);
  for (const [k, v] of [["title", t], ["desc", d.description]]) {
    if (!v) continue;
    if (seen[k].has(v)) problems.push(`${f}: duplicate ${k} with ${seen[k].get(v)}`);
    seen[k].set(v, f);
  }
}

function checkLinks(f, body) {
  const links = [...body.matchAll(/\]\((\/[^)\s]*)\)/g), ...body.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const l of links) {
    const p = l.split("#")[0].split("?")[0];
    if (!valid.has(p)) problems.push(`${f}: broken internal link ${l}`);
  }
}

for (const s of services) {
  checkSeo(s.f, s.data);
  if (!imageKeys.has(s.data.image)) problems.push(`${s.f}: unknown image ${s.data.image}`);
  for (const g of s.data.gallery || []) if (!imageKeys.has(g)) problems.push(`${s.f}: unknown gallery image ${g}`);
  for (const r of s.data.related || []) if (!servicePaths.has(r)) problems.push(`${s.f}: unknown related service ${r}`);
  for (const p of s.data.posts || []) if (!postSlugs.has(p)) problems.push(`${s.f}: unknown related post ${p}`);
  if ((s.data.faqs || []).length < 6) warn.push(`${s.f}: fewer than 6 FAQs`);
  checkLinks(s.f, s.content + JSON.stringify(s.data.faqs || []));
}
for (const p of posts) {
  checkSeo(p.f, p.data);
  if (!cats.includes(p.data.category)) problems.push(`${p.f}: bad category ${p.data.category}`);
  if (!imageKeys.has(p.data.image)) problems.push(`${p.f}: unknown image ${p.data.image}`);
  for (const r of p.data.services || []) if (!servicePaths.has(r)) problems.push(`${p.f}: unknown service ${r}`);
  for (const r of p.data.related || []) if (!postSlugs.has(r)) problems.push(`${p.f}: unknown related post ${r}`);
  checkLinks(p.f, p.content);
}
for (const p of pages) {
  checkSeo(p.f, p.data);
  checkLinks(p.f, p.content);
}

console.log(`Checked ${services.length} service pages, ${posts.length} posts, ${pages.length} pages.`);
warn.forEach((w) => console.log("WARN ", w));
problems.forEach((p) => console.log("ERROR", p));
if (problems.length) process.exit(1);
console.log("Content OK");
