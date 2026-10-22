/** Field definitions for the smart quote form. Shared by the form and the API. */

export const DIVISIONS = ["pest-control", "cleaning", "moving-relocation", "transport-logistics"] as const;
export type DivisionKey = (typeof DIVISIONS)[number];

export const divisionLabels: Record<DivisionKey, string> = {
  "pest-control": "Fumigation & pest control",
  cleaning: "Cleaning",
  "moving-relocation": "Moving & relocation",
  "transport-logistics": "Transport & logistics",
};

export const options = {
  pestType: ["Cockroaches", "Bed bugs", "Mosquitoes", "Rats or mice", "Other / not sure"],
  propertyType: ["Apartment / flat", "Standalone house / maisonette", "Bedsitter / studio", "Office", "Restaurant / food business", "Shop / warehouse", "Other"],
  propertySize: ["Bedsitter / studio", "1 bedroom", "2 bedrooms", "3 bedrooms", "4 bedrooms", "5+ bedrooms", "Small office / premises", "Medium office / premises", "Large office / premises"],
  cleaningType: ["Deep cleaning (home)", "Regular cleaning (home)", "Move-in / move-out cleaning", "Office cleaning", "Post-construction cleaning", "Airbnb / short-term rental turnover", "Other / not sure"],
  frequency: ["One-off", "Weekly", "Fortnightly", "Monthly", "Daily (office)", "Several times a week (office)", "Not sure yet"],
  moveType: ["Bedsitter / studio", "1 bedroom", "2 bedrooms", "3 bedrooms", "4+ bedrooms", "Office", "A few items only"],
};

/** Maps ?type= slugs from service pages to preselected form values. */
export const typePreset: Record<string, Partial<Record<string, string>>> = {
  "cockroach-control": { pestType: "Cockroaches" },
  "bed-bug-control": { pestType: "Bed bugs" },
  "mosquito-control": { pestType: "Mosquitoes" },
  "rodent-control": { pestType: "Rats or mice" },
  "residential-cleaning": { cleaningType: "Deep cleaning (home)" },
  "office-cleaning": { cleaningType: "Office cleaning", frequency: "Daily (office)" },
  "post-construction-cleaning": { cleaningType: "Post-construction cleaning", frequency: "One-off" },
  "office-relocation": { moveType: "Office" },
};

/** Human-readable label for each stored field. */
export const fieldLabels: Record<string, string> = {
  pestType: "Pest",
  propertyType: "Property type",
  propertySize: "Property size",
  location: "Location",
  details: "Infestation details",
  cleaningType: "Cleaning type",
  rooms: "Rooms / workspaces",
  frequency: "Frequency",
  origin: "Moving from",
  destination: "Moving to",
  moveType: "Size of move",
  inventory: "Approximate inventory",
  access: "Access considerations",
  collection: "Collection location",
  delivery: "Delivery destination",
  goods: "Goods",
  quantity: "Quantity / weight / volume",
  handling: "Special handling",
  preferredDate: "Preferred date",
  message: "Message",
};

const serviceFields: Record<DivisionKey, string[]> = {
  "pest-control": ["pestType", "propertyType", "propertySize", "location", "details"],
  cleaning: ["cleaningType", "propertySize", "rooms", "location", "frequency"],
  "moving-relocation": ["origin", "destination", "moveType", "inventory", "access"],
  "transport-logistics": ["collection", "delivery", "goods", "quantity", "handling"],
};

export function enquiryDetails(e: Record<string, unknown> & { division: DivisionKey }) {
  return [...serviceFields[e.division], "preferredDate", "message"]
    .map((k) => ({ key: k, label: fieldLabels[k], value: String(e[k] ?? "").trim() }))
    .filter((f) => f.value);
}

export function enquirySummary(e: Record<string, unknown> & { division: DivisionKey }) {
  const lines = enquiryDetails(e).map((f) => `${f.label}: ${f.value}`);
  return [`Service: ${divisionLabels[e.division]}`, ...lines].join("\n");
}

/** Short WhatsApp text containing the selected service and key details. */
export function enquiryWhatsappText(e: Record<string, unknown> & { division: DivisionKey; name?: string }) {
  const where = String(e.location || e.origin || e.collection || "").trim();
  const what =
    e.division === "pest-control"
      ? ({ Cockroaches: "cockroach control", "Bed bugs": "bed bug control", Mosquitoes: "mosquito control", "Rats or mice": "rodent control" } as Record<string, string>)[String(e.pestType)] ?? "pest control"
      : e.division === "cleaning"
        ? String(e.cleaningType || "cleaning").toLowerCase()
        : e.division === "moving-relocation"
          ? `a move (${String(e.moveType || "").toLowerCase()})`
          : "goods transport";
  const head = `Hello Cleantique, I would like a quotation for ${what}${where ? ` in ${where}` : ""}.`;
  const body = enquiryDetails(e)
    .filter((f) => f.key !== "message")
    .map((f) => `${f.label}: ${f.value}`)
    .join("\n");
  return `${head}\n\n${body}${e.name ? `\n\nName: ${e.name}` : ""}`;
}
