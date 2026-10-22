# Cleantique Solutions website

Next.js (App Router) + TypeScript + Tailwind CSS. Content lives in `/content` as Markdown and JSON so it can be edited in the browser-based editor at `/cms/` or directly in the files.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Quality checks:

```bash
npm run check:content                         # frontmatter, SEO lengths, links, images
npm run build && npm start                    # then, in another terminal:
BASE=http://localhost:3000 npm run check:links  # crawl every page in the sitemap
```

Copy `.env.example` to `.env.local` and fill in values. The site runs locally without any of them; the quote form stores submissions in `.data/enquiries.json` when no database is configured.

## Where things are

| What | Where |
|---|---|
| Service pages (13) | `content/services/*.md` |
| Blog articles (20) | `content/posts/*.md` |
| About, process, privacy, terms | `content/pages/*.md` |
| Business details, hours, service areas, analytics IDs | `content/site.json` |
| Service divisions and mega menu | `content/divisions.json` |
| General FAQs | `content/faqs.json` |
| Customer reviews | `content/reviews.json` |
| Old-URL redirects | `content/redirects.json` |
| Images and alt text | `public/images/` + `src/lib/images.ts` |
| Logo (original SVG, unchanged) | `public/brand/cleantique-logo-green.svg` |
| Design tokens (brand colours, fonts) | `tailwind.config.ts`, `src/app/layout.tsx` |
| Quote form | `src/components/QuoteForm.tsx`, `src/app/api/enquiry/route.ts` |
| Enquiries inbox | `/admin/enquiries/` (password protected) |
| Content editor | `/cms/` (Decap CMS, GitHub sign-in) |

Full documentation, the SEO strategy, deployment steps and launch checklist are in [`docs/`](docs/).
