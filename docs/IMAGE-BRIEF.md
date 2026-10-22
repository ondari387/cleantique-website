# Image brief: replacing stock photography

The new site launches with the 23 images migrated from the old site. Most are licensed stock (Pexels) and several do not look like Nairobi. Real photos of Cleantique's people and jobs are the single biggest trust upgrade available.

## How to replace an image
1. Save the photo as a landscape JPG/WebP, at least 1600px wide, with a descriptive filename (e.g. `cleantique-technician-bed-bug-inspection-kilimani.webp`).
2. Put it in `public/images/`.
3. Add an entry to `src/lib/images.ts` with width, height and an accurate alt text describing what is in the photo.
4. Change the `image:` (or `gallery:`) key in the relevant content file.

Get written consent from anyone identifiable in a photo, avoid showing customers' faces or house numbers, and never photograph inside a client's home without permission.

## Shot list (priority order)

| # | Shot | Used on |
|---|---|---|
| 1 | Technician in Cleantique PPE inspecting a mattress seam with a torch | Bed bug page, homepage mosaic |
| 2 | Technician placing gel bait inside a kitchen cabinet | Cockroach page |
| 3 | Outdoor fogging in a Nairobi compound (Karen/Runda style garden) | Mosquito page |
| 4 | Technician sealing a gap around a pipe / placing a bait station | Rodent page |
| 5 | Cleaning team (2–3 people, uniforms) in a bright Nairobi apartment kitchen | Cleaning parent page, homepage |
| 6 | Bathroom limescale before/after | Residential cleaning, blog |
| 7 | Office cleaning in the evening, empty desks | Office cleaning |
| 8 | Post-construction: removing film from new windows; dusty site → clean handover | Post-construction page |
| 9 | Moving crew wrapping a sofa; labelled boxes "Bedroom 2" | Moving pages, homepage |
| 10 | Loading a truck at an apartment block | Home moving |
| 11 | Office crates numbered to desks | Office relocation |
| 12 | Delivery vehicle being loaded with cartons at a Nairobi warehouse | Transport page, homepage mosaic |
| 13 | Team portrait (for About) | About page |

Use natural light, no heavy filters, real locations. Avoid AI-generated imagery.

## Images to replace first
- `delivery-truck-at-loading-bay` (Japanese truck, visible foreign signage) — transport page hero.
- `cargo-truck-on-open-highway` (generic, non-Kenyan landscape).
- `modern-office-lounge-interior` (stock interior) — office pages.
- Any image showing people who are clearly not in Kenya.
