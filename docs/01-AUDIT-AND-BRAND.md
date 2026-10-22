# 1. Existing website audit and brand inventory

Audit date: 21 October 2026. Method: live pages of https://cleantique.co.ke inspected in a browser (rendered DOM, computed styles, Elementor global kit variables, XML sitemaps), plus page text extraction for every main page. No paid SEO tools were available, so no traffic, ranking or backlink data is included.

## 1.1 Platform and tracking

| Item | Finding |
|---|---|
| Platform | WordPress with Elementor 3.34.1, VamTam theme kit, Rank Math SEO (sitemap generator) |
| Tracking found in page | Google Tag Manager `GTM-W6H9BJJW`; GA4 `G-S8NSBKQZ35`; Google Ads `AW-17497576869` (gtag.js loaded alongside GTM) |
| Sitemaps | `/sitemap_index.xml` → post, page and category sitemaps (Rank Math) |
| Homepage title | "Fumigation and Pest Control in Nairobi \| Cleantique Solutions" |

All three tracking IDs are carried into the new site (`content/site.json`, overridable by env vars). Because the old site loads both GTM and gtag.js, there is a risk of double-counting if the GTM container also fires GA4/Ads tags. Check the container; if it does, set `NEXT_PUBLIC_DISABLE_GTAG=1`.

## 1.2 URL inventory (all found URLs)

**Pages in the Rank Math page sitemap (22):** `/`, `/services/bedbug-fumigation/`, `/about-us/terms-of-service/`, `/about-us/privacy-policy/`, `/contact-us/`, `/about-us/`, `/services/`, `/free-quote/`, `/blog/`, `/about-us/faq/`, `/about-us/customer-reviews/`, `/about-us/cleaning-process/`, `/services/office-cleaning/`, `/services/move-in-out-cleaning/`, `/services/residental/`, `/services/recurring-cleaning/`, `/services/short-term-rentals/`, `/services/commercial/`, `/services/airbnb-cleaning/`, `/services/apartment-cleaning/`, `/services/deep-cleaning/`, `/services/house-cleaning/`.

**Pages linked from navigation but missing from the sitemap (12):** `/pest-control-nairobi/`, `/cockroach-fumigation-nairobi/`, `/mosquito-fumigation-nairobi/`, `/rodent-control-nairobi/`, `/movers-nairobi/`, `/home-relocation/`, `/office-relocation/`, `/cleaning-services-nairobi/`, `/residential-cleaning/`, `/office-cleaning/`, `/post-construction-cleaning/`, `/transport-logistics-nairobi/`. These are the newest, best-written pages, yet the sitemap does not list them, so search engines may be slow to find them.

**Posts:** 3 in the post sitemap (`/the-deep-cleaning-and-organizing/`, `/the-importance-of-regular-mattress-cleaning-for-better-sleep/`, `/house-cleaning-services-before-moving-in/`) plus 7 newer posts linked from `/blog/` but not in the sitemap (`/choosing-a-logistics-partner-nairobi/`, `/post-construction-cleaning-what-it-includes/`, `/office-relocation-guide-nairobi/`, `/moving-house-in-nairobi-checklist/`, `/cockroach-infestation-signs-and-treatment/`, `/how-to-get-rid-of-bed-bugs-nairobi/`, `/cost-of-fumigation-in-nairobi/`).

**Categories:** `/category/cleaning/`, `/category/pest-control/`, `/category/moving-relocation/`, `/category/transport-logistics/`.

Every one of these is mapped to a new URL in `content/redirects.json` (see `03-REDIRECTS.md`).

## 1.3 Strengths worth keeping

- The 2026 service pages (pest control, movers, cleaning, transport) are genuinely good: specific, honest, practical, with process steps, tables and FAQs. Much of their operational detail (two-visit bed bug treatment, review visits, labelling by room, out-of-hours office work) was carried into the new pages.
- A clear, honest voice ("Two visits, because eggs survive the first", "We decline what we should decline").
- Correct NAP details and a WhatsApp-first contact route that suits the Nairobi market.
- Service-area list covering Nairobi and satellite towns.

## 1.4 Weaknesses and risks found

| Issue | Impact | Fixed in new site |
|---|---|---|
| Two parallel URL sets: legacy template pages under `/services/*` and newer pages at root (`/pest-control-nairobi/` etc.) | Duplicate/competing pages, keyword cannibalisation for "cleaning" terms | One clean hierarchy under `/services/`, all legacy URLs 301-redirected |
| Newer pages and posts missing from XML sitemap | Slower discovery and indexing | Generated sitemap includes every page |
| Leftover theme template copy on About/FAQ/Services ("Empowering Thousands of Users and Enterprises", "average employee tenure is three to six years", "bonded and insured", "15–20% tip", "visit our pricing page", "dishwasher") | Unverifiable/foreign claims undermine trust | Not carried over |
| Homepage positioned as pest-control-only | Under-represents three of four divisions | Homepage presents all four divisions equally |
| Generic image alt text (e.g. "pexels-liliana-drew-9462732") and empty logo alt | Accessibility and image SEO | Descriptive alt text for every image (`src/lib/images.ts`) |
| Social links mislabelled (LinkedIn label → x.com, TikTok → YouTube; Facebook/Instagram → root domains) | Broken trust signals | Social links removed until correct profile URLs are supplied (`content/site.json` → `social`) |
| "100% Satisfaction Guarantee" without terms | Vague guarantee | Replaced with the specific, verified commitment (return to fix in-scope misses; pest follow-up within agreed window) |
| Quote form references GDPR rather than Kenya's Data Protection Act | Compliance wording | New privacy policy references the Data Protection Act, 2019 and the ODPC |
| Heavy Elementor/theme stack | Weaker Core Web Vitals | Static Next.js pages, self-hosted fonts, optimised images |

## 1.5 Brand asset inventory

### Logo
- `public/brand/cleantique-logo-green.svg` — original SVG downloaded unchanged from `/wp-content/uploads/2024/12/cleantique-logo-green.svg`. Its viewBox shows the green wordmark with the yellow cleaning-tools mark. (The file also contains a hidden blue variant outside the viewBox; it is left untouched.)
- `public/brand/cleantique-logo-full-transparent.png` — full lock-up with "Solutions", from the owner's Downloads folder (800×800, transparent). Used for structured data and social images.
- `src/app/icon.png`, `src/app/apple-icon.png` — from the site's existing favicon (`cropped-Cleantique-favicon-270x270.png`).

Logo colours (from the SVG): green `#599F44`, light green `#90C73E`, yellow `#EDD846`.

### Colours (Elementor global kit, verbatim)

| Token | HEX | Role on the old site | Role in the new site |
|---|---|---|---|
| accent_2 | `#3CA200` | Primary green | `brand-500`: icons, accents, large text |
| accent_1 | `#F2D701` | Yellow accent | `sun`: primary quote buttons (ink text, 12.2:1 contrast) |
| accent_3 | `#E8F5D3` | Mint background | `brand-100`: soft sections, chips |
| accent_4 | `#F4F6F0` | Off-white | `paper`: hero and alternate sections |
| heading colour | `#161A14` | Headings | `ink` |
| body colour | `#5A6154` | Body text | `muted.light`; body copy uses `#33372F`/`#4B5345` for stronger contrast |

Derived shades (documented, not new brand colours): `#2B7400` (brand-700, links and white-text buttons, 5.8:1 on white) and `#173A06` (brand-900, dark bands). They were added because `#3CA200` on white is 3.3:1, below WCAG AA for normal text.

### Typography

| Use | Old site (computed) | New site |
|---|---|---|
| H1/H2 | Archivo 600 (overrides the kit) | Archivo 600/700 |
| H3–H6, buttons, UI | Parkinsans 500/600 | Parkinsans 500/600 |
| Body | Outfit 300, 16–18px | Outfit 400, 17px (weight raised from 300 for readability) |

All three are Google Fonts, self-hosted at build time via `next/font` (no runtime request to Google).

### Photography
26 images were migrated from the old site (see `source-assets/` in the project folder). Most are licensed stock (Pexels), some show non-Kenyan context (a US-branded trailer yard, a Japanese truck). Two were excluded (a sponge graphic and the US trailer yard). See `IMAGE-BRIEF.md` for the replacement shot list. The owner's Downloads folder also contains Cleantique social-media ad graphics; these have text baked in and are not suitable as page photography.
