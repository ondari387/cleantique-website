/**
 * Branded HTML email templates for Cleantique's enquiry flow.
 *
 * Built as plain table-based HTML (no CSS grid/flexbox) with inline styles
 * throughout, since that's what renders consistently across Gmail, Outlook,
 * and mobile mail clients. Colors and type match the site's Tailwind tokens
 * (see tailwind.config.ts) so the email reads as the same brand as the site.
 */
import { escapeHtml } from "./email";
import { divisionLabels, type DivisionKey } from "./enquiry-shared";

const colors = {
  brand900: "#173A06", // header band
  brand700: "#2B7400", // links, accessible green text on white
  brand500: "#3CA200", // accent
  brand100: "#E8F5D3", // mint chip background
  paper: "#F4F6F0", // page background behind the card
  sun: "#F2D701", // primary button fill (ink text, high contrast)
  ink: "#161A14", // headings
  muted: "#5A6154", // secondary text
  line: "#DCE3D2", // hairline borders
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://cleantique.co.ke").replace(/\/$/, "");
const logoUrl = `${siteUrl}/brand/cleantique-logo-full-transparent.png`;

const fontStack =
  "'Outfit', Arial, Helvetica, sans-serif";

/** Wraps a block of inner HTML in the shared branded shell: header, white card, footer. */
function shell(opts: { previewText: string; bodyHtml: string }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cleantique Solutions</title>
</head>
<body style="margin:0;padding:0;background:${colors.paper};font-family:${fontStack};">
  <!-- Preview text shown in inbox lists, hidden in the body -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(opts.previewText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.paper};padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 2px rgba(22,26,20,.06);">
          <!-- Header -->
          <tr>
            <td style="background:${colors.brand900};padding:28px 32px;text-align:center;">
              <img src="${logoUrl}" width="56" height="56" alt="Cleantique Solutions" style="display:inline-block;border-radius:10px;">
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px;">
              ${opts.bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px;background:${colors.brand100};border-top:1px solid ${colors.line};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${fontStack};font-size:13px;color:${colors.muted};line-height:1.6;">
                    <strong style="color:${colors.ink};">Cleantique Solutions</strong><br>
                    Fumigation &amp; pest control · Cleaning · Moving &amp; relocation · Transport &amp; logistics<br>
                    Nairobi, Kenya ·
                    <a href="tel:+254793329293" style="color:${colors.brand700};text-decoration:none;">+254 793 329 293</a>
                    ·
                    <a href="mailto:hi@cleantique.co.ke" style="color:${colors.brand700};text-decoration:none;">hi@cleantique.co.ke</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">
          <tr>
            <td style="padding:16px 32px 0;font-family:${fontStack};font-size:12px;color:${colors.muted};text-align:center;">
              This message was sent in connection with a request submitted at
              <a href="${siteUrl}" style="color:${colors.muted};">cleantique.co.ke</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function badge(text: string) {
  return `<span style="display:inline-block;background:${colors.brand100};color:${colors.brand700};font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;">${escapeHtml(text)}</span>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:${colors.sun};color:${colors.ink};font-family:${fontStack};font-size:15px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px;">${escapeHtml(label)}</a>`;
}

function fieldRow(label: string, valueHtml: string) {
  return `<tr>
    <td style="padding:9px 16px 9px 0;color:${colors.muted};font-size:14px;font-family:${fontStack};vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:9px 0;color:${colors.ink};font-size:14px;font-family:${fontStack};vertical-align:top;">${valueHtml}</td>
  </tr>`;
}

/* ---------------------------------------------------------------------- */
/* Internal notification — sent to the Cleantique team (ENQUIRY_TO)       */
/* ---------------------------------------------------------------------- */

export function internalQuoteRequestEmail(opts: {
  id: string;
  division: DivisionKey;
  name: string;
  phone: string;
  email: string;
  details: { label: string; value: string }[];
  sourcePage: string;
}) {
  const { id, division, name, phone, email, details, sourcePage } = opts;
  const divisionLabel = divisionLabels[division];

  const detailRows = details.map((f) => fieldRow(f.label, escapeHtml(f.value).replace(/\n/g, "<br>"))).join("");

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          ${badge(divisionLabel)}
          <h1 style="margin:14px 0 4px;font-family:${fontStack};font-size:22px;font-weight:700;color:${colors.ink};">New quote request</h1>
          <p style="margin:0 0 24px;font-family:${fontStack};font-size:14px;color:${colors.muted};">Reference ${escapeHtml(id)}</p>
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid ${colors.line};border-bottom:1px solid ${colors.line};padding:18px 0;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${fieldRow("Name", escapeHtml(name))}
            ${fieldRow("Phone", `<a href="tel:${escapeHtml(phone)}" style="color:${colors.brand700};text-decoration:none;">${escapeHtml(phone)}</a>`)}
            ${fieldRow("Email", email ? `<a href="mailto:${escapeHtml(email)}" style="color:${colors.brand700};text-decoration:none;">${escapeHtml(email)}</a>` : "<span style=\"color:#9aa392;\">Not provided</span>")}
            ${detailRows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top:24px;">
          ${button(`tel:${encodeURIComponent(phone)}`, "Call now")}
          &nbsp;&nbsp;
          <a href="https://wa.me/${phone.replace(/[^\d]/g, "")}" style="display:inline-block;color:${colors.brand700};font-family:${fontStack};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border:1.5px solid ${colors.brand700};border-radius:999px;">WhatsApp</a>
        </td>
      </tr>
      <tr>
        <td style="padding-top:20px;font-family:${fontStack};font-size:12.5px;color:${colors.muted};">
          Submitted from ${escapeHtml(sourcePage || "the website")}.
        </td>
      </tr>
    </table>`;

  const text = [
    `New quote request ${id}`,
    `Service: ${divisionLabel}`,
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || "-"}`,
    ...details.map((f) => `${f.label}: ${f.value}`),
    "",
    `Submitted from: ${sourcePage || "-"}`,
  ].join("\n");

  return {
    subject: `New quote request ${id}: ${divisionLabel} – ${name}`,
    text,
    html: shell({ previewText: `${name} just requested a quote for ${divisionLabel.toLowerCase()}.`, bodyHtml }),
  };
}

/* ---------------------------------------------------------------------- */
/* Customer confirmation — sent to the person who submitted the enquiry   */
/* ---------------------------------------------------------------------- */

export function customerConfirmationEmail(opts: {
  id: string;
  division: DivisionKey;
  name: string;
  details: { label: string; value: string }[];
}) {
  const { id, division, name, details } = opts;
  const divisionLabel = divisionLabels[division];
  const firstName = name.trim().split(/\s+/)[0] || name;

  const detailRows = details.map((f) => fieldRow(f.label, escapeHtml(f.value).replace(/\n/g, "<br>"))).join("");

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          ${badge(divisionLabel)}
          <h1 style="margin:14px 0 10px;font-family:${fontStack};font-size:22px;font-weight:700;color:${colors.ink};">Thanks, ${escapeHtml(firstName)} — we've got your request</h1>
          <p style="margin:0 0 24px;font-family:${fontStack};font-size:15px;line-height:1.6;color:${colors.muted};">
            Your reference is <strong style="color:${colors.ink};">${escapeHtml(id)}</strong>. A member of our team will
            review the details below and get back to you, usually the same day during business hours
            (Mon&ndash;Fri 9am&ndash;6pm, Sat&ndash;Sun 9am&ndash;4pm).
          </p>
        </td>
      </tr>
      <tr>
        <td style="background:${colors.paper};border-radius:10px;padding:18px 20px;">
          <p style="margin:0 0 10px;font-family:${fontStack};font-size:13px;font-weight:600;color:${colors.muted};text-transform:uppercase;letter-spacing:.04em;">What you sent us</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${detailRows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding-top:24px;font-family:${fontStack};font-size:14px;line-height:1.6;color:${colors.muted};">
          Need to add anything or in a hurry? Reach us directly and mention reference ${escapeHtml(id)}.
        </td>
      </tr>
      <tr>
        <td style="padding-top:16px;">
          ${button("https://wa.me/254793329293", "Message us on WhatsApp")}
          &nbsp;&nbsp;
          <a href="tel:+254793329293" style="display:inline-block;color:${colors.brand700};font-family:${fontStack};font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border:1.5px solid ${colors.brand700};border-radius:999px;">Call us</a>
        </td>
      </tr>
    </table>`;

  const text = [
    `Thanks, ${firstName} — we've got your request.`,
    `Reference: ${id}`,
    `Service: ${divisionLabel}`,
    "",
    "What you sent us:",
    ...details.map((f) => `${f.label}: ${f.value}`),
    "",
    "We'll be in touch, usually the same day during business hours.",
    "WhatsApp: https://wa.me/254793329293",
    "Phone: +254 793 329 293",
  ].join("\n");

  return {
    subject: `We've received your request (${id}) — Cleantique`,
    text,
    html: shell({ previewText: `Your ${divisionLabel.toLowerCase()} request is in — reference ${id}.`, bodyHtml }),
  };
}
