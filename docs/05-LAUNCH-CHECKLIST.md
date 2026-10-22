# 5. Launch checklist

Work through this on the Vercel preview URL before switching DNS, then repeat the starred (★) items on the live domain.

## Owner confirmations (must be done before launch)
- [ ] Read `07-OWNER-CONFIRMATIONS.md` and confirm or correct every listed claim
- [ ] Privacy policy and terms reviewed (ideally by a lawyer); deposit, cancellation and retention terms match how you actually operate
- [ ] Correct social media profile URLs added to `content/site.json` (or left empty)
- [ ] Google Reviews link added to `content/reviews.json` → `googleReviewsUrl` (optional)
- [ ] Payment methods confirmed for the terms page

## Content
- [ ] `npm run check:content` passes with no errors
- [ ] Every service page read through once by the owner for operational accuracy
- [ ] Spelling and grammar checked
- [ ] No placeholder text anywhere (search the build output for "OWNER/", "lorem", "TODO")

## Functionality
- [ ] ★ Quote form: submit a test for each of the 4 services; confirm email arrives at hi@cleantique.co.ke and the entry appears in `/admin/enquiries/`
- [ ] ★ Form validation: submit empty, invalid phone, unticked consent; errors are announced and linked
- [ ] ★ Success state shows a reference number and a working WhatsApp button with the details pre-filled
- [ ] Links from service pages preselect the right service/type (`/request-quote/?service=…&type=…`)
- [ ] ★ Click-to-call opens the dialler on a phone
- [ ] ★ WhatsApp links open the right chat with the service-specific message
- [ ] ★ Email links open the mail client
- [ ] Blog search returns results; category filters work
- [ ] Mega menu: opens on hover and click, closes on Escape and click-outside, keyboard reachable
- [ ] Mobile menu: opens, accordions expand, links navigate and close the menu
- [ ] Mobile sticky Call / WhatsApp / Quote bar visible on phones only
- [ ] `/admin/enquiries/` asks for a password; CSV export works; status changes save
- [ ] `/cms/` signs in with GitHub and can save a draft (after 4.5 setup)
- [ ] 404 page shows for an unknown URL

## SEO
- [ ] `npm run build && npm start`, then `npm run check:links` passes (status 200, one H1, title, description, canonical, alt text on every page)
- [ ] ★ `https://cleantique.co.ke/sitemap.xml` lists all pages; `robots.txt` references it
- [ ] Preview deployments are noindexed (`NEXT_PUBLIC_NOINDEX=1` on Preview only)
- [ ] ★ Production is **not** noindexed
- [ ] Structured data validates in Google's Rich Results Test and the Schema Markup Validator (home, a service page, a blog post, FAQs)
- [ ] ★ Spot-check 10 old URLs from `03-REDIRECTS.md`: each returns 308 to the right page
- [ ] ★ Submit the sitemap in Search Console; request indexing for the homepage and the four division pages

## Analytics
- [ ] ★ GTM container loads (Tag Assistant)
- [ ] ★ GA4 real-time shows page views; no double page views
- [ ] ★ `generate_lead`, `click_call`, `click_whatsapp` events appear in GA4 DebugView
- [ ] Key events marked in GA4; Google Ads conversion linked

## Performance and accessibility
- [ ] PageSpeed Insights (mobile) for home, a service page and a blog post; aim for LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] Keyboard-only walkthrough: skip link, menus, form, FAQ accordions, visible focus throughout
- [ ] Screen reader spot check (VoiceOver on iPhone/Mac): headings, form labels and errors read correctly
- [ ] Layout checked at 360px, 768px, 1024px and 1440px widths

## Go-live
- [ ] WordPress backup taken and stored
- [ ] DNS switched (A + CNAME only; MX untouched)
- [ ] ★ SSL active on both apex and www; www redirects to apex
- [ ] ★ Test email to hi@cleantique.co.ke still works (MX intact)
- [ ] Google Business Profile website link updated
- [ ] Old WordPress hosting kept for 30 days, then cancelled
