/**
 * Image registry. Every image used on the site is listed here once, with its
 * dimensions, accurate alt text and licence/source note. Content files refer to
 * images by key (e.g. `image: bed-bug-on-mattress-close-up`).
 *
 * To replace a photo: drop the new file into /public/images, add or update its
 * entry here, and change the key in the relevant content file.
 *
 * Source: all current images were migrated from cleantique.co.ke (Oct 2026).
 * Files originally named "pexels-*" are Pexels-licensed stock; the others were
 * uploaded to the old site as Cleantique assets. Replace stock with genuine
 * Cleantique project photography as it becomes available (see docs/IMAGE-BRIEF.md).
 */
export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  source: "cleantique-site" | "pexels" | "client-supplied";
};

const img = (
  file: string,
  width: number,
  height: number,
  alt: string,
  source: SiteImage["source"] = "cleantique-site",
): SiteImage => ({ src: `/images/${file}.webp`, width, height, alt, source });

export const images = {
  "fumigation-technician-protective-suit": img(
    "fumigation-technician-protective-suit", 820, 547,
    "Pest control technician in a full protective suit and hood carrying out a fumigation treatment in a storeroom",
  ),
  "technician-applying-indoor-pest-treatment": img(
    "technician-applying-indoor-pest-treatment", 820, 547,
    "Technician in protective clothing applying an indoor pest control treatment",
  ),
  "pest-control-worker-spraying-building": img(
    "pest-control-worker-spraying-building", 820, 547,
    "Pest control worker with a backpack sprayer treating the outside of a residential building",
  ),
  "outdoor-mosquito-fogging-treatment": img(
    "outdoor-mosquito-fogging-treatment", 820, 547,
    "Technician wearing a mask fogging an outdoor garden area for mosquito control",
  ),
  "german-cockroach-close-up": img(
    "german-cockroach-close-up", 820, 547,
    "Close-up of a German cockroach, the species most often found in Nairobi kitchens",
  ),
  "bed-bug-treatment-in-bedroom": img(
    "bed-bug-treatment-in-bedroom", 820, 547,
    "Technician in protective gear treating a bed and bedroom furniture for bed bugs",
  ),
  "bed-bug-on-mattress-close-up": img(
    "bed-bug-on-mattress-close-up", 820, 547,
    "Close-up of an adult bed bug on a mattress cover",
  ),
  "brown-rat-foraging-outdoors": img(
    "brown-rat-foraging-outdoors", 820, 547,
    "Brown rat foraging on the ground, the rodent most commonly found around Nairobi homes and businesses",
  ),
  "packed-boxes-and-covered-sofa-house-move": img(
    "packed-boxes-and-covered-sofa-house-move", 820, 547,
    "Packed cardboard boxes stacked beside a sofa covered with a protective sheet, ready for a house move",
  ),
  "person-carrying-moving-box": img(
    "person-carrying-moving-box", 820, 547,
    "Person carrying a labelled cardboard moving box through an apartment", "pexels",
  ),
  "couple-unpacking-boxes-new-home": img(
    "couple-unpacking-boxes-new-home", 820, 547,
    "Couple unpacking boxes in the kitchen of their new home",
  ),
  "cleaner-wiping-wooden-table": img(
    "cleaner-wiping-wooden-table", 820, 547,
    "Cleaner in a green uniform and gloves wiping down a wooden table", "pexels",
  ),
  "cleaner-scrubbing-kitchen-counter": img(
    "cleaner-scrubbing-kitchen-counter", 760, 507,
    "Cleaner in an apron and yellow gloves scrubbing a kitchen counter with a brush",
  ),
  "cleaner-dusting-shelves": img(
    "cleaner-dusting-shelves", 820, 547,
    "Cleaner in yellow gloves dusting wall shelves", "pexels",
  ),
  "modern-office-lounge-interior": img(
    "modern-office-lounge-interior", 820, 547,
    "Clean, modern office lounge with sofas, armchairs and wooden shelving", "pexels",
  ),
  "technician-vacuuming-cushion": img(
    "technician-vacuuming-cushion", 760, 507,
    "Cleaning technician in a mask and gloves vacuuming a cushion",
  ),
  "cleaning-team-in-kitchen-wide": img(
    "cleaning-team-in-kitchen-wide", 1600, 429,
    "Two cleaners working in a bright modern kitchen, one wiping cabinets and one cleaning the counter", "pexels",
  ),
  "steam-cleaning-sofa-upholstery": img(
    "steam-cleaning-sofa-upholstery", 760, 507,
    "Cleaner using a steam machine to deep clean a fabric armchair",
  ),
  "gloved-hand-wiping-cabinet-handle": img(
    "gloved-hand-wiping-cabinet-handle", 820, 547,
    "Gloved hand wiping a kitchen cabinet handle, a high-touch surface", "pexels",
  ),
  "cleaner-vacuuming-living-room": img(
    "cleaner-vacuuming-living-room", 820, 547,
    "Cleaner vacuuming the floor of a bright living room", "pexels",
  ),
  "cleaner-holding-cleaning-supplies": img(
    "cleaner-holding-cleaning-supplies", 820, 547,
    "Cleaner carrying spray bottles and cleaning supplies into a home",
  ),
  "cargo-truck-on-open-highway": img(
    "cargo-truck-on-open-highway", 1280, 1600,
    "Cargo truck travelling on an open highway at dusk",
  ),
  "delivery-truck-at-loading-bay": img(
    "delivery-truck-at-loading-bay", 820, 547,
    "Delivery truck parked at a loading bay ready for goods to be loaded",
  ),
  // Supplied by Cleantique (Oct 2026).
  "technician-thermal-fogging-courtyard": img(
    "technician-thermal-fogging-courtyard", 1536, 1024,
    "Pest control technician in blue overalls, goggles and a respirator thermal fogging a building courtyard", "client-supplied",
  ),
  "bed-bug-on-bedding-close-up": img(
    "bed-bug-on-bedding-close-up", 1600, 900,
    "Close-up of an adult bed bug on white bedding", "client-supplied",
  ),
  "cockroach-on-kitchen-floor": img(
    "cockroach-on-kitchen-floor", 1600, 900,
    "Cockroach on a kitchen floor among food crumbs beside a bin", "client-supplied",
  ),
  "mosquito-feeding-on-skin": img(
    "mosquito-feeding-on-skin", 1600, 901,
    "Close-up of a mosquito feeding on skin in a bedroom", "client-supplied",
  ),
  "rat-on-wooden-floor": img(
    "rat-on-wooden-floor", 1600, 900,
    "Rat on a wooden floor", "client-supplied",
  ),
  "mop-and-cleaning-supplies-on-tiled-floor": img(
    "mop-and-cleaning-supplies-on-tiled-floor", 1600, 900,
    "Microfibre mop on a freshly cleaned tiled floor, with a bucket of gloves, cloths and spray bottles behind", "client-supplied",
  ),
  "movers-loading-boxes-into-truck": img(
    "movers-loading-boxes-into-truck", 1536, 1024,
    "Three movers loading packed cardboard boxes into a container truck outside a home", "client-supplied",
  ),
  "truck-on-nairobi-expressway": img(
    "truck-on-nairobi-expressway", 1600, 900,
    "Cargo truck seen in a car wing mirror on a Nairobi highway, with the city skyline behind", "client-supplied",
  ),
  "woman-relaxing-on-sofa-at-home": img(
    "woman-relaxing-on-sofa-at-home", 1100, 880,
    "Woman relaxing on a sofa at home with headphones on, arms raised and smiling", "client-supplied",
  ),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;

export function getImage(key: string | undefined): SiteImage {
  if (key && key in images) return images[key as ImageKey];
  return images["cleaner-holding-cleaning-supplies"];
}
