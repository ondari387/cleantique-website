import { marked } from "marked";

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/&/g, "and")
    .replace(/<[^>]+>/g, "")
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
}

/**
 * Renders trusted Markdown from /content into HTML.
 * - Adds stable ids to H2/H3 and returns a table of contents.
 * - Wraps tables so they scroll horizontally on small screens.
 * - Marks external links with rel="noopener".
 * Content is authored by the site owner (not user input), so raw HTML in
 * Markdown is allowed.
 */
export function renderMarkdown(md: string): { html: string; toc: TocItem[] } {
  const raw = marked.parse(md, { gfm: true, async: false }) as string;
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  let html = raw.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = stripTags(inner).trim();
    let id = slugify(text);
    const n = used.get(id) ?? 0;
    used.set(id, n + 1);
    if (n > 0) id = `${id}-${n + 1}`;
    toc.push({ id, text, level: Number(lvl) as 2 | 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });

  html = html
    .replace(/<table>/g, '<div class="table-wrap" role="region" aria-label="Table" tabindex="0"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:\/\/(?!cleantique\.co\.ke)[^"]+)"/g, '<a href="$1" rel="noopener" target="_blank"');

  return { html, toc };
}
