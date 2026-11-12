import { NextResponse } from "next/server";
import { enquiryDetails, enquirySchema, type DivisionKey } from "@/lib/enquiry";
import { newEnquiryId, saveEnquiry } from "@/lib/enquiry-store";
import { sendEmail } from "@/lib/email";
import { customerConfirmationEmail, internalQuoteRequestEmail } from "@/lib/email-templates";

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

  const detailFields = enquiryDetails(e as never);

  // Internal notification to the Cleantique team.
  try {
    const { subject, text, html } = internalQuoteRequestEmail({
      id,
      division,
      name: e.name,
      phone: e.phone,
      email: e.email || "",
      details: detailFields,
      sourcePage: e.sourcePage || "",
    });
    const r = await sendEmail({ subject, text, html, replyTo: e.email || undefined });
    emailed = r.sent;
    if (!r.sent) errors.push(`email: ${r.reason}`);
  } catch (err) {
    errors.push(`email: ${(err as Error).message}`);
  }

  // Confirmation to the person who submitted the enquiry, if they gave us an address.
  if (e.email) {
    try {
      const { subject, text, html } = customerConfirmationEmail({
        id,
        division,
        name: e.name,
        details: detailFields,
      });
      await sendEmail({ to: e.email, subject, text, html });
    } catch (err) {
      // Not fatal: the team notification above already went out (or was attempted),
      // and the customer still gets their on-screen confirmation. Just log it.
      errors.push(`customer-email: ${(err as Error).message}`);
    }
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
