import { NextResponse } from "next/server";
import { STATUSES, updateEnquiry, type EnquiryStatus } from "@/lib/enquiry-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Protected by HTTP Basic Auth in src/middleware.ts
export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "") as EnquiryStatus;
  const notes = form.get("notes");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  await updateEnquiry(id, {
    status: STATUSES.includes(status) ? status : undefined,
    notes: typeof notes === "string" ? notes.slice(0, 5000) : undefined,
  });
  return NextResponse.redirect(new URL("/admin/enquiries/", req.url), 303);
}
