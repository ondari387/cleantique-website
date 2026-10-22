# Editing content

## Option A: the online editor (/cms/)
After the one-time setup in `04-DEPLOYMENT.md` §4.5, go to `https://cleantique.co.ke/cms/` and sign in with GitHub.

| To… | Go to |
|---|---|
| Write or edit a blog article | **Blog articles** → New / choose an article |
| Edit a service page, its FAQs or SEO title/description | **Service pages** |
| Edit About, Our process, Privacy, Terms | **Other pages** |
| Change phone, email, hours, service areas, social links, analytics IDs | **Settings → Business details** |
| Edit general FAQs | **Settings → General FAQs** |
| Add a customer review (with permission) | **Settings → Customer reviews** |
| Add a redirect when you change a URL | **Settings → Redirects** |

Changes are saved as drafts. Click **Publish** to make them live; the site rebuilds in about a minute.

Image fields take an **image key** from `src/lib/images.ts` (e.g. `bed-bug-on-mattress-close-up`). Uploading brand-new images and registering their alt text is a developer step (see `IMAGE-BRIEF.md`).

## Option B: edit the files
All content is plain Markdown/JSON in `/content`. Each Markdown file has a frontmatter block (between `---` lines) for SEO and page settings, followed by the body.

Writing guidance:
- One H1 per page is set by the `h1`/`title` field — start body headings at `##`.
- Keep SEO titles around 50–60 characters and descriptions around 120–155.
- Link to other pages with relative links, e.g. `[bed bug control](/services/pest-control/bed-bug-control/)`.
- Run `npm run check:content` before publishing to catch broken links and missing images.
- Never add prices, certifications, statistics or reviews that cannot be verified.

## Enquiries
Quote requests are emailed to hi@cleantique.co.ke and stored at `/admin/enquiries/`. Update each one's status as you follow up; this is what lets you measure which pages bring bookings.
