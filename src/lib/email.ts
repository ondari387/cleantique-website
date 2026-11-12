/**
 * Sends emails with the Resend HTTP API (no SDK needed).
 * Env:
 *   RESEND_API_KEY  – API key from resend.com (the sending domain must be verified there)
 *   ENQUIRY_TO      – where internal notifications go (default hi@cleantique.co.ke)
 *   ENQUIRY_FROM    – verified sender, e.g. "Cleantique Solutions <website@cleantique.co.ke>"
 */
export async function sendEmail(opts: { to?: string | string[]; subject: string; text: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "RESEND_API_KEY not set" } as const;
  const to = opts.to ?? (process.env.ENQUIRY_TO || "hi@cleantique.co.ke").split(",").map((s) => s.trim());
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM || "Cleantique Solutions <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend error ${res.status}: ${body.slice(0, 300)}`);
  }
  return { sent: true } as const;
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
