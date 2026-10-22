# 7. Things the owner must confirm before launch

The brief forbids publishing invented business facts. Everything on the site comes from (a) the current cleantique.co.ke pages, (b) the owner's answers on 21 October 2026, or (c) general, sourced industry guidance. Items below are business-specific statements that need a final yes/no from you. Edit the listed file if anything is wrong.

## Confirmed by the owner (21 Oct 2026)
- Pest control follow-up is included in quotes: bed bugs two treatments about 10–14 days apart; cockroach review visit; return if the pest comes back within the agreed window.
- Office cleaning and office moves can run outside working hours (evenings, overnight, weekends).
- In-scope misses are corrected at no extra cost (replaces "100% Satisfaction Guarantee").
- The 9 customer reviews are genuine and published with permission.
- Contact details: +254 793 329 293, hi@cleantique.co.ke, Nairobi.

## Deliberately NOT claimed (not confirmed)
- "Own vehicles and own crew/drivers" (the old site said this; you did not confirm it). The site says "a vehicle matched to the load" and "the crew".
- Insurance / goods-in-transit cover. The site tells customers to ask about cover.
- PCPB or NEMA licences, certifications, awards, years in business, team size, customer counts.
- Prices. Pricing articles explain the factors instead.

## Carried over from the current site — please confirm

| Statement | Where it appears | File |
|---|---|---|
| Products used are "registered products" applied at label rates | Pest pages, About, FAQs | `content/services/pest-*.md`, `content/pages/about.md` |
| Product name and re-entry time are given in writing before treatment | Pest pages, homepage | as above, `src/app/page.tsx` |
| Bed bug rooms stay empty 4–6 hours; fogging needs everyone indoors 2–3 hours; indoor mosquito spraying 2–3 hours | Pest pages, FAQs | pest service files |
| Steam is used on suitable bed bug surfaces | Bed bug page | `bed-bug-control.md` |
| Discreet / unmarked arrival available on request | Bed bug page highlights | `bed-bug-control.md` |
| Rodent work uses tamper-resistant stations, recorded placement, carcass removal | Rodent page | `rodent-control.md` |
| Cleaning teams bring equipment and materials; clients can supply their own products | Cleaning pages | cleaning files |
| Work is checked against a written checklist before the team leaves | Cleaning pages | cleaning files |
| Office cleaning: one-month trial possible; consumables can be supplied; contract reviewed after month one | Office cleaning page | `office-cleaning.md` |
| Moving: survey in person or by video; written price; boxes delivered on request; dismantle/reassemble beds, wardrobes, desks; label by room | Moving pages | moving files |
| Moves and deliveries outside Nairobi "on request" | Moving and transport pages | as above |
| Same-day collection often possible in Nairobi if called early; contract runs with monthly invoicing | Transport page | `transport-logistics.md` |
| General goods only: no hazardous, refrigerated or permit loads | Transport page | `transport-logistics.md` |
| Payment due at time of service unless agreed otherwise | FAQs, Terms | `content/faqs.json`, `terms-of-service.md` |
| Opening hours Mon–Fri 9–6, Sat–Sun 9–4 | Site-wide | `content/site.json` |
| Service areas list (16 areas) | Site-wide | `content/site.json` |

## Policy wording written for you to review (legal review recommended)
- **Privacy policy:** 24-month retention of enquiry data; processors (hosting, email, database, analytics); data may be processed outside Kenya.
- **Terms:** 24 hours' notice for cleaning/pest rescheduling; deposits for larger jobs "as stated on the quote"; damage reports within 48 hours with photos.

## Missing information that would strengthen the site
- Real photos of the team, vehicles and completed jobs (see `IMAGE-BRIEF.md`).
- Correct social media profile URLs.
- Google Business Profile review link.
- Any genuine credentials (e.g. PCPB-related licences) — add them to the About page and pest pages only once verified, with the licence number.
- A named person (owner/manager) for the About page, if you are comfortable with that.
- Exact business address, if you want a map embed and fuller LocalBusiness data. Currently only "Nairobi" and the Google Maps link are used.
