import { NextResponse } from "next/server";
import { divisionLabels, enquiryDetails, enquirySchema, enquirySummary, type DivisionKey } from "@/lib/enquiry";
import { newEnquiryId, saveEnquiry } from "@/lib/enquiry-store";
import { escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* Best-effort in-memory rate limit: 5 submissions per IP per 10 minutes per server instance. */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile not configured: honeypot + timing + rate limit still apply.
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please wait a few minutes, or contact us on WhatsApp." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot is treated as success so bots learn nothing.
    if (fieldErrors.company) return NextResponse.json({ ok: true, id: "CT-RECEIVED" });
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const e = parsed.data;

  // Submissions completed in under 3 seconds are almost always automated.
  if (e.startedAt && Date.now() - e.startedAt < 3000) {
    return NextResponse.json({ ok: true, id: "CT-RECEIVED" });
  }
  if (!(await verifyTurnstile(e.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "We could not verify the security check. Please try again." }, { status: 400 });
  }

  const id = newEnquiryId();
  const details = Object.fromEntries(enquiryDetails(e as never).map((f) => [f.label, f.value]));
  const division = e.division as DivisionKey;

  let stored = false;
  let emailed = false;
  const errors: string[] = [];

  try {
    await saveEnquiry({ id, division, name: e.name, phone: e.phone, email: e.email, details, sourcePage: e.sourcePage });
    stored = true;
  } catch (err) {
    errors.push(`store: ${(err as Error).message}`);
  }

  try {
    const summary = enquirySummary(e as never);
    const rows = enquiryDetails(e as never)
      .map((f) => `<tr><td style="padding:6px 12px 6px 0;color:#5a6154;vertical-align:top">${escapeHtml(f.label)}</td><td style="padding:6px 0">${escapeHtml(f.value).replace(/\n/g, "<br>")}</td></tr>`)
      .join("");
    const r = await sendEmail({
      subject: `New quote request ${id}: ${divisionLabels[division]} – ${e.name}`,
      replyTo: e.email || undefined,
      text: `New quote request ${id}\n\nName: ${e.name}\nPhone: ${e.phone}\nEmail: ${e.email || "-"}\n\n${summary}\n\nSubmitted from: ${e.sourcePage || "-"}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;color:#161a14">
        <h2 style="margin:0 0 4px">New quote request</h2>
        <p style="margin:0 0 16px;color:#5a6154">${id} · ${escapeHtml(divisionLabels[division])}</p>
        <table style="border-collapse:collapse">
          <tr><td style="padding:6px 12px 6px 0;color:#5a6154">Name</td><td>${escapeHtml(e.name)}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5a6154">Phone</td><td><a href="tel:${escapeHtml(e.phone)}">${escapeHtml(e.phone)}</a></td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#5a6154">Email</td><td>${escapeHtml(e.email || "-")}</td></tr>
          ${rows}
        </table>
        <p style="margin-top:16px;color:#5a6154">Submitted from ${escapeHtml(e.sourcePage || "-")}</p>
      </div>`,
    });
    emailed = r.sent;
    if (!r.sent) errors.push(`email: ${r.reason}`);
  } catch (err) {
    errors.push(`email: ${(err as Error).message}`);
  }

  if (errors.length) console.error(`[enquiry ${id}]`, errors.join(" | "));

  if (!stored && !emailed) {
    return NextResponse.json(
      { ok: false, error: "Your request could not be sent right now. Please contact us on WhatsApp or call +254 793 329 293." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true, id });
}
