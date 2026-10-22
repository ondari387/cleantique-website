import { listEnquiries } from "@/lib/enquiry-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

// Protected by HTTP Basic Auth in src/middleware.ts
export async function GET() {
  const rows = await listEnquiries(5000);
  const detailKeys = Array.from(new Set(rows.flatMap((r) => Object.keys(r.details))));
  const header = ["id", "created_at", "status", "division", "name", "phone", "email", ...detailKeys, "source_page", "notes"];
  const lines = rows.map((r) =>
    [r.id, r.createdAt, r.status, r.division, r.name, r.phone, r.email, ...detailKeys.map((k) => r.details[k] ?? ""), r.sourcePage, r.notes]
      .map(esc)
      .join(","),
  );
  const csv = [header.map(esc).join(","), ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="cleantique-enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
