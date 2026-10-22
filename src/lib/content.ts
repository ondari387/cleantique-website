import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown, type TocItem } from "./markdown";
import divisionsData from "@content/divisions.json";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Division = (typeof divisionsData)[number];
export const divisions: Division[] = divisionsData;

export function getDivision(key: string) {
  return divisions.find((d) => d.key === key);
}

export type Faq = { q: string; a: string };

export type ServicePage = {
  path: string;
  division: string;
  kind: "parent" | "child";
  slug: string; // last segment, e.g. "bed-bug-control" or the division key for parents
  order: number;
  title: string;
  seoTitle: string;
  description: string;
  h1: string;
  lede: string;
  image: string;
  gallery: string[];
  highlights: string[];
  whatsapp: string;
  faqs: Faq[];
  related: string[];
  posts: string[];
  updated: string;
  html: string;
  toc: TocItem[];
  wordCount: number;
};

export type PostCategory = "pest-control" | "cleaning" | "moving-relocation" | "transport-logistics";

export const postCategories: { key: PostCategory; name: string; description: string }[] = [
  { key: "pest-control", name: "Pest Control", description: "Identifying pests, preparing for treatment, prevention and what fumigation really costs." },
  { key: "cleaning", name: "Cleaning", description: "Checklists, pricing factors and practical advice for homes, offices and handovers." },
  { key: "moving-relocation", name: "Moving & Relocation", description: "Planning a house or office move in Nairobi without the usual surprises." },
  { key: "transport-logistics", name: "Transport & Logistics", description: "Choosing a transport partner, understanding costs and getting deliveries right." },
];

export type Post = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: PostCategory;
  date: string;
  updated: string;
  author: string;
  image: string;
  excerpt: string;
  services: string[];
  related: string[];
  featured: boolean;
  html: string;
  toc: TocItem[];
  wordCount: number;
  readingMinutes: number;
};

function readDir(sub: string) {
  const dir = path.join(CONTENT_DIR, sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ file: f, raw: fs.readFileSync(path.join(dir, f), "utf8") }));
}

function countWords(md: string) {
  return md.replace(/[#>*_|`\-]/g, " ").split(/\s+/).filter(Boolean).length;
}

function asDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

let servicesCache: ServicePage[] | null = null;

export function getAllServices(): ServicePage[] {
  if (servicesCache) return servicesCache;
  servicesCache = readDir("services")
    .map(({ raw, file }) => {
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);
      const p = String(data.path);
      const segs = p.split("/").filter(Boolean);
      const faqText = (data.faqs || []).map((f: Faq) => `${f.q} ${f.a}`).join(" ");
      return {
        path: p,
        division: String(data.division),
        kind: data.kind === "parent" ? "parent" : "child",
        slug: segs[segs.length - 1],
        order: Number(data.order ?? 99),
        title: String(data.title),
        seoTitle: String(data.seoTitle),
        description: String(data.description),
        h1: String(data.h1),
        lede: String(data.lede),
        image: String(data.image),
        gallery: data.gallery || [],
        highlights: data.highlights || [],
        whatsapp: String(data.whatsapp || data.title).toLowerCase(),
        faqs: data.faqs || [],
        related: data.related || [],
        posts: data.posts || [],
        updated: asDate(data.updated),
        html,
        toc,
        wordCount: countWords(content) + countWords(faqText) + countWords(String(data.lede)),
        _file: file,
      } as ServicePage;
    })
    .sort((a, b) => a.order - b.order);
  return servicesCache;
}

export function getService(p: string) {
  return getAllServices().find((s) => s.path === p);
}

export function getServicesForDivision(division: string) {
  return getAllServices().filter((s) => s.division === division && s.kind === "child");
}

let postsCache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (postsCache) return postsCache;
  postsCache = readDir("posts")
    .map(({ raw, file }) => {
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);
      const words = countWords(content);
      return {
        slug: String(data.slug || file.replace(/\.md$/, "")),
        title: String(data.title),
        seoTitle: String(data.seoTitle || data.title),
        description: String(data.description),
        category: data.category as PostCategory,
        date: asDate(data.date),
        updated: asDate(data.updated || data.date),
        author: String(data.author || "Cleantique Solutions"),
        image: String(data.image),
        excerpt: String(data.excerpt || data.description),
        services: data.services || [],
        related: data.related || [],
        featured: Boolean(data.featured),
        html,
        toc,
        wordCount: words,
        readingMinutes: Math.max(3, Math.round(words / 220)),
      } satisfies Post;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
  return postsCache;
}

export function getPost(slug: string) {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(cat: PostCategory) {
  return getAllPosts().filter((p) => p.category === cat);
}

export function getRelatedPosts(post: Post, limit = 3) {
  const all = getAllPosts();
  const picked = post.related.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Post[];
  for (const p of all) {
    if (picked.length >= limit) break;
    if (p.slug !== post.slug && p.category === post.category && !picked.includes(p)) picked.push(p);
  }
  return picked.slice(0, limit);
}

export function getPostsBySlugs(slugs: string[]) {
  const all = getAllPosts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean) as Post[];
}

export type MdPage = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  h1: string;
  lede: string;
  updated: string;
  noindex: boolean;
  html: string;
  toc: TocItem[];
};

export function getPage(slug: string): MdPage {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "pages", `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const { html, toc } = renderMarkdown(content);
  return {
    slug,
    title: String(data.title),
    seoTitle: String(data.seoTitle || data.title),
    description: String(data.description),
    h1: String(data.h1 || data.title),
    lede: String(data.lede || ""),
    updated: asDate(data.updated),
    noindex: Boolean(data.noindex),
    html,
    toc,
  };
}

export function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8")) as T;
}
