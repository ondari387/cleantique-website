import { divisionLabels, type DivisionKey } from "@/lib/enquiry-shared";
import { listEnquiries, STATUSES } from "@/lib/enquiry-store";

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "254");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const dynamic = "force-dynamic";
export const metadata = { title: "Enquiries", robots: { index: false, follow: false } };

const statusStyle: Record<string, string> = {
  new: "bg-sun text-ink",
  contacted: "bg-brand-100 text-brand-800",
  quoted: "bg-brand-200 text-brand-900",
  booked: "bg-brand-700 text-white",
  closed: "bg-paper text-muted",
  spam: "bg-red-100 text-red-800",
};

export default async function EnquiriesAdmin({ searchParams }: { searchParams: Promise<{ status?: string; division?: string }> }) {
  const sp = await searchParams;
  let rows: Awaited<ReturnType<typeof listEnquiries>> = [];
  let error = "";
  try {
    rows = await listEnquiries();
  } catch (e) {
    error = (e as Error).message;
  }
  const filtered = rows.filter((r) => (!sp.status || r.status === sp.status) && (!sp.division || r.division === sp.division));
  const counts = Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]));

  return (
    <section className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Quote requests</h1>
          <p className="mt-1 text-muted">{rows.length} total · newest first</p>
        </div>
        <a href="/api/admin/enquiries/export/" className="rounded-pill border border-ink/20 px-4 py-2 font-ui text-sm font-semibold text-ink hover:border-brand-700">
          Download CSV
        </a>
      </div>

      {error && <p className="mt-6 rounded-card bg-red-50 p-4 text-red-900">Could not load enquiries: {error}</p>}

      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Filter by status">
        <a href="/admin/enquiries/" className={`rounded-pill px-3 py-1.5 ring-1 ring-line ${!sp.status ? "bg-ink text-white" : "bg-white"}`}>All</a>
        {STATUSES.map((s) => (
          <a key={s} href={`/admin/enquiries/?status=${s}`} className={`rounded-pill px-3 py-1.5 capitalize ring-1 ring-line ${sp.status === s ? "bg-ink text-white" : "bg-white"}`}>
            {s} ({counts[s]})
          </a>
        ))}
      </nav>

      <div className="mt-6 space-y-4">
        {filtered.length === 0 && <p className="rounded-card bg-paper p-6 text-muted">No enquiries match this filter.</p>}
        {filtered.map((r) => (
          <details key={r.id} className="rounded-card border border-line bg-white">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4">
              <span className={`rounded-pill px-2.5 py-0.5 font-ui text-xs font-semibold capitalize ${statusStyle[r.status] || ""}`}>{r.status}</span>
              <span className="font-ui font-semibold text-ink">{r.name}</span>
              <span className="text-muted">{divisionLabels[r.division as DivisionKey] ?? r.division}</span>
              <span className="text-muted">{r.phone}</span>
              <span className="ml-auto text-sm text-muted">
                {new Date(r.createdAt).toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short" })} · {r.id}
              </span>
            </summary>
            <div className="grid gap-6 border-t border-line px-5 py-5 md:grid-cols-[1.4fr_1fr]">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.95rem]">
                <dt className="text-muted">Phone</dt>
                <dd><a className="text-brand-700 underline" href={`tel:${r.phone}`}>{r.phone}</a> · <a className="text-brand-700 underline" href={waLink(r.phone, `Hello ${r.name.split(" ")[0]}, this is Cleantique Solutions following up on your quote request ${r.id}.`)} target="_blank" rel="noopener">WhatsApp</a></dd>
                <dt className="text-muted">Email</dt>
                <dd>{r.email ? <a className="text-brand-700 underline" href={`mailto:${r.email}`}>{r.email}</a> : "—"}</dd>
                {Object.entries(r.details).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap">{v}</dd>
                  </div>
                ))}
                <dt className="text-muted">Page</dt>
                <dd className="break-all">{r.sourcePage || "—"}</dd>
              </dl>
              <form method="post" action="/api/admin/enquiries/" className="space-y-3">
                <input type="hidden" name="id" value={r.id} />
                <label className="block text-sm font-medium text-ink">
                  Status
                  <select name="status" defaultValue={r.status} className="mt-1 block w-full rounded-xl border border-ink/20 px-3 py-2 capitalize">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-ink">
                  Internal notes
                  <textarea name="notes" defaultValue={r.notes} rows={4} className="mt-1 block w-full rounded-xl border border-ink/20 px-3 py-2" />
                </label>
                <button type="submit" className="rounded-pill bg-brand-700 px-5 py-2 font-ui text-sm font-semibold text-white">Save</button>
              </form>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
