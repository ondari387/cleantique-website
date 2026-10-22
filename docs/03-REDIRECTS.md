# 3. Redirect plan (old WordPress URLs → new URLs)

All 45 known URLs from the current site are permanently redirected (HTTP 308, treated by Google as a permanent redirect, like 301). The list lives in `content/redirects.json` and is applied by `next.config.mjs`. It can also be edited in the CMS under **Settings → Redirects**.

## Principles

- Every URL found in the Rank Math sitemaps, the main navigation, the footer and the blog index is mapped.
- Each old page goes to the closest equivalent new page, not to the homepage.
- Legacy template cleaning pages (`/services/house-cleaning/`, `/services/airbnb-cleaning/` etc.) are consolidated into the residential or office cleaning page they compete with.
- Old blog posts at the root are mapped to the new article that covers the same intent. The mattress-cleaning post has no direct replacement and goes to the residential cleaning page.
- The new site uses trailing slashes (`/about/`). Requests without a slash are first normalised, then redirected.

## Map

| Old URL | New URL |
|---|---|
| `/pest-control-nairobi/` | `/services/pest-control/` |
| `/cockroach-fumigation-nairobi/` | `/services/pest-control/cockroach-control/` |
| `/services/bedbug-fumigation/` | `/services/pest-control/bed-bug-control/` |
| `/mosquito-fumigation-nairobi/` | `/services/pest-control/mosquito-control/` |
| `/rodent-control-nairobi/` | `/services/pest-control/rodent-control/` |
| `/movers-nairobi/` | `/services/moving-relocation/` |
| `/home-relocation/` | `/services/moving-relocation/home-moving/` |
| `/office-relocation/` | `/services/moving-relocation/office-relocation/` |
| `/cleaning-services-nairobi/` | `/services/cleaning/` |
| `/residential-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/office-cleaning/` | `/services/cleaning/office-cleaning/` |
| `/post-construction-cleaning/` | `/services/cleaning/post-construction-cleaning/` |
| `/transport-logistics-nairobi/` | `/services/transport-logistics/` |
| `/about-us/` | `/about/` |
| `/about-us/cleaning-process/` | `/our-process/` |
| `/about-us/faq/` | `/faqs/` |
| `/about-us/customer-reviews/` | `/reviews/` |
| `/about-us/privacy-policy/` | `/privacy-policy/` |
| `/about-us/terms-of-service/` | `/terms-of-service/` |
| `/contact-us/` | `/contact/` |
| `/free-quote/` | `/request-quote/` |
| `/services/office-cleaning/` | `/services/cleaning/office-cleaning/` |
| `/services/commercial/` | `/services/cleaning/office-cleaning/` |
| `/services/move-in-out-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/services/residental/` | `/services/cleaning/residential-cleaning/` |
| `/services/recurring-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/services/short-term-rentals/` | `/services/cleaning/residential-cleaning/` |
| `/services/airbnb-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/services/apartment-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/services/deep-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/services/house-cleaning/` | `/services/cleaning/residential-cleaning/` |
| `/category/cleaning/` | `/blog/category/cleaning/` |
| `/category/pest-control/` | `/blog/category/pest-control/` |
| `/category/moving-relocation/` | `/blog/category/moving-relocation/` |
| `/category/transport-logistics/` | `/blog/category/transport-logistics/` |
| `/cost-of-fumigation-in-nairobi/` | `/blog/fumigation-cost-nairobi/` |
| `/how-to-get-rid-of-bed-bugs-nairobi/` | `/blog/how-to-get-rid-of-bed-bugs-kenya/` |
| `/cockroach-infestation-signs-and-treatment/` | `/blog/cockroach-infestation-kitchen/` |
| `/moving-house-in-nairobi-checklist/` | `/blog/house-moving-checklist-nairobi/` |
| `/office-relocation-guide-nairobi/` | `/blog/office-relocation-checklist/` |
| `/post-construction-cleaning-what-it-includes/` | `/blog/post-construction-cleaning-checklist-kenya/` |
| `/choosing-a-logistics-partner-nairobi/` | `/blog/choose-transport-logistics-company-kenya/` |
| `/the-deep-cleaning-and-organizing/` | `/blog/deep-cleaning-vs-regular-cleaning/` |
| `/house-cleaning-services-before-moving-in/` | `/blog/move-in-move-out-cleaning/` |
| `/the-importance-of-regular-mattress-cleaning-for-better-sleep/` | `/services/cleaning/residential-cleaning/` |

## After launch

1. In Google Search Console, open **Pages → Not found (404)** weekly for the first two months and add any missing old URLs to `content/redirects.json`.
2. Keep the redirects in place permanently. They cost nothing and protect existing links.
3. If the old site had URLs with query strings or uploads that were linked externally (e.g. `/wp-content/uploads/...` PDFs), add rules for any that show up in Search Console.
4. Update Google Business Profile, social profiles and directory listings to point at the new URLs directly.
