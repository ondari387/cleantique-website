# 6. Post-launch SEO measurement plan

## What success looks like
More qualified enquiries (form, calls and WhatsApp) from organic search across all four divisions, not just pest control. Rankings and traffic are leading indicators; enquiries are the outcome.

## Tools
- **Google Search Console** — impressions, clicks, queries, pages, indexing, Core Web Vitals.
- **GA4** — sessions from Organic Search, key events (`generate_lead`, `click_call`, `click_whatsapp`), landing pages.
- **Enquiries inbox** — every submission records the page it came from; use the status column to track which enquiries became bookings.
- **Google Business Profile Insights** — calls, website clicks and direction requests from Maps.

## Baseline (week 0)
Before DNS switch, export from Search Console (last 3 months): total clicks/impressions, top 50 queries, top 50 pages. Export GA4 organic sessions and key events for the same period. This is the comparison point; expect some fluctuation for 2–6 weeks after a migration.

## Weekly (first 8 weeks)
- Search Console → Pages: new 404s (add redirects), "Crawled – not indexed", "Duplicate" issues.
- Search Console → Sitemaps: submitted vs indexed count.
- Enquiries inbox: number of submissions by division; any spam getting through.

## Monthly report (one page)

| Metric | Source | Breakdown |
|---|---|---|
| Organic clicks and impressions | Search Console | By division (filter pages by `/services/pest-control/`, `/services/cleaning/` etc. and `/blog/`) |
| Average position for priority terms | Search Console → Queries | The primary keywords in `02-SEO-STRATEGY.md` |
| Organic sessions | GA4 | Landing page |
| Quote form submissions | GA4 `generate_lead` + inbox | By division |
| Calls and WhatsApp clicks | GA4 `click_call`, `click_whatsapp` | By page |
| Enquiry-to-booking rate | Inbox statuses | By division and by source page |
| Core Web Vitals | Search Console | Mobile, by URL group |
| Blog performance | Search Console + GA4 | Clicks per article; articles that lead to quote clicks |

## Quarterly actions
1. **Refresh content that is close to page one.** Queries in positions 8–20 with good impressions: improve the matching page (answer the query more directly, add a FAQ, add a photo, tighten the title).
2. **Fill gaps.** New queries that appear in Search Console without a matching page are candidates for new articles.
3. **Prune or merge** articles with no impressions after six months.
4. **Add evidence.** Replace stock photos with real project photos; add new customer reviews with permission.
5. **Phase 2 location pages** — only for areas with genuine, unique local content (see `02-SEO-STRATEGY.md` §2.7).
6. **Update dates honestly.** Change `updated` in frontmatter only when content materially changes.

## Off-site actions that support rankings
- Keep Google Business Profile complete: categories for each service, hours, photos, service areas; post updates monthly; reply to every review.
- Ask satisfied customers for Google reviews (a short link in the follow-up WhatsApp message).
- Make sure the business name, phone and website are identical on every directory listing.
- Seek genuine local links: estate associations, property managers, contractors and partners you work with.

## Targets
Targets should be set after the first 3 months of baseline data from the new site. Avoid setting ranking targets for individual keywords before then; there is no reliable volume or difficulty data for this market in our toolset.
