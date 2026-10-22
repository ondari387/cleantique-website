"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { DIVISIONS, divisionLabels, enquiryWhatsappText, options, typePreset, type DivisionKey } from "@/lib/enquiry-shared";
import { whatsappHref, telHref, site } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { trackEvent } from "./Analytics";

type Values = Record<string, string>;
type Errors = Record<string, string>;

const divisionIcons: Record<DivisionKey, IconName> = {
  "pest-control": "bug",
  cleaning: "sparkle",
  "moving-relocation": "box",
  "transport-logistics": "truck",
};

const divisionHints: Record<DivisionKey, string> = {
  "pest-control": "Cockroaches, bed bugs, mosquitoes, rodents",
  cleaning: "Home, office, move-out, post-construction",
  "moving-relocation": "House moves and office relocation",
  "transport-logistics": "Collections, deliveries, distribution",
};

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: { reset: (id?: string) => void };
  }
}

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [division, setDivision] = useState<DivisionKey | "">("");
  const [values, setValues] = useState<Values>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [refId, setRefId] = useState("");
  const [startedAt] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Preselect from ?service=&type= (links from service pages and articles).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sv = params.get("service");
    const t = params.get("type");
    if (sv && (DIVISIONS as readonly string[]).includes(sv)) setDivision(sv as DivisionKey);
    if (t && typePreset[t]) setValues((v) => ({ ...(typePreset[t] as Values), ...v }));
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, [k]: val }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFormError("");
    if (!division) {
      setErrors({ division: "Please choose the service you need." });
      setFormError("Please choose the service you need.");
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const fd = new FormData(ev.currentTarget);
    const payload = {
      ...values,
      division,
      consent,
      company: String(fd.get("company") || ""),
      startedAt,
      sourcePage: typeof window !== "undefined" ? window.location.pathname + window.location.search : "",
      turnstileToken: String(fd.get("cf-turnstile-response") || "") || undefined,
      email: values.email || "",
    };
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string; fieldErrors?: Errors };
      if (!res.ok || !data.ok) {
        setErrors(data.fieldErrors || {});
        setFormError(data.error || "Something went wrong. Please try again, or contact us on WhatsApp.");
        setStatus("idle");
        window.turnstile?.reset();
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setRefId(data.id || "");
      setStatus("done");
      trackEvent("generate_lead", { service: division, form: "quote" });
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFormError("We could not reach the server. Check your connection and try again, or contact us on WhatsApp.");
      setStatus("idle");
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  const waText = division ? enquiryWhatsappText({ ...values, division, name: values.name }) : "";

  if (status === "done") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="rounded-card border border-brand-200 bg-brand-100 p-6 outline-none sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white">
            <Icon name="check" className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <h2 className="font-display text-2xl font-semibold text-ink">Request received</h2>
        </div>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Thank you, {values.name?.split(" ")[0] || "we have your details"}. Your reference is <strong className="text-ink">{refId}</strong>.
          We will contact you on {values.phone} during working hours (Mon–Fri 9am–6pm, Sat–Sun 9am–4pm) to confirm the details
          and your quote.
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Want a faster answer? Send the same details on WhatsApp and add a photo of the space or the problem.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappHref(`${waText}\n\nReference: ${refId}`)}
            target="_blank"
            rel="noopener"
            data-track="click_whatsapp"
            className="inline-flex items-center gap-2 rounded-pill bg-brand-700 px-5 py-3 font-ui font-semibold text-white hover:bg-brand-800"
          >
            <Icon name="whatsapp" className="h-5 w-5" /> Send on WhatsApp with a photo
          </a>
          <Link href="/" className="inline-flex items-center rounded-pill border border-ink/20 bg-white px-5 py-3 font-ui font-semibold text-ink">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const fieldProps = (k: string) => ({
    id: `f-${k}`,
    name: k,
    value: values[k] || "",
    onChange: set(k),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `e-${k}` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby="form-help">
      <p id="form-help" className="sr-only">Fields marked with an asterisk are required.</p>

      <div ref={summaryRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {formError && (
          <div role="alert" className="flex gap-3 rounded-card border border-red-300 bg-red-50 p-4 text-[0.97rem] text-red-900">
            <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">{formError}</p>
              {Object.values(errors).filter(Boolean).length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {Object.entries(errors)
                    .filter(([, m]) => m)
                    .map(([k, m]) => (
                      <li key={k}>
                        <a href={k === "division" ? "#division" : `#f-${k}`} className="underline">{m}</a>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step 1: service */}
      <fieldset id="division">
        <legend className="font-ui text-[1.1rem] font-semibold text-ink">
          1. Which service do you need? <span aria-hidden="true" className="text-red-700">*</span>
        </legend>
        <div className={`mt-4 grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-4"}`}>
          {DIVISIONS.map((d) => {
            const checked = division === d;
            return (
              <label
                key={d}
                className={`relative flex cursor-pointer flex-col items-start gap-1.5 rounded-card border p-4 transition-colors focus-within:ring-2 focus-within:ring-brand-700 ${
                  checked ? "border-brand-700 bg-brand-100" : "border-line bg-white hover:border-brand-300"
                }`}
              >
                <input
                  type="radio"
                  name="division"
                  value={d}
                  checked={checked}
                  onChange={() => {
                    setDivision(d);
                    setErrors((er) => ({ ...er, division: "" }));
                  }}
                  className="sr-only"
                />
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${checked ? "bg-brand-700 text-white" : "bg-brand-100 text-brand-700"}`}
                  aria-hidden="true"
                >
                  <Icon name={divisionIcons[d]} className="h-5 w-5 shrink-0" />
                </span>
                <span className="mt-1 pr-6 font-ui font-semibold leading-snug text-ink">{divisionLabels[d]}</span>
                <span className="text-[0.9rem] leading-snug text-muted">{divisionHints[d]}</span>
                <span
                  className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border ${checked ? "border-brand-700 bg-brand-700 text-white" : "border-ink/20 bg-white text-transparent"}`}
                  aria-hidden="true"
                >
                  <Icon name="check" className="h-3.5 w-3.5 shrink-0" strokeWidth={2.6} />
                </span>
              </label>
            );
          })}
        </div>
        {errors.division && <p id="e-division" className="mt-2 text-[0.92rem] text-red-800">{errors.division}</p>}
      </fieldset>

      {division && (
        <fieldset>
          <legend className="font-ui text-[1.1rem] font-semibold text-ink">2. Tell us about the job</legend>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {division === "pest-control" && (
              <>
                <Select label="Type of pest" k="pestType" opts={options.pestType} req errors={errors} {...fieldProps("pestType")} />
                <Select label="Property type" k="propertyType" opts={options.propertyType} req errors={errors} {...fieldProps("propertyType")} />
                <Select label="Approximate property size" k="propertySize" opts={options.propertySize} req errors={errors} {...fieldProps("propertySize")} />
                <Input label="Location (estate or area)" k="location" req placeholder="e.g. Kilimani, off Argwings Kodhek" errors={errors} {...fieldProps("location")} />
                <Area label="Infestation details" k="details" hint="Where you see them, for how long, and anything already tried." errors={errors} full {...fieldProps("details")} />
              </>
            )}
            {division === "cleaning" && (
              <>
                <Select label="Type of cleaning" k="cleaningType" opts={options.cleaningType} req errors={errors} {...fieldProps("cleaningType")} />
                <Select label="Approximate property size" k="propertySize" opts={options.propertySize} req errors={errors} {...fieldProps("propertySize")} />
                <Input label="Number of rooms, bathrooms or workspaces" k="rooms" placeholder="e.g. 3 bedrooms, 2 bathrooms" errors={errors} {...fieldProps("rooms")} />
                <Input label="Location (estate or area)" k="location" req placeholder="e.g. Syokimau" errors={errors} {...fieldProps("location")} />
                <Select label="How often?" k="frequency" opts={options.frequency} req errors={errors} {...fieldProps("frequency")} />
              </>
            )}
            {division === "moving-relocation" && (
              <>
                <Input label="Moving from" k="origin" req placeholder="Area and building, e.g. South B, 3rd floor" errors={errors} {...fieldProps("origin")} />
                <Input label="Moving to" k="destination" req placeholder="Area and building" errors={errors} {...fieldProps("destination")} />
                <Select label="Size of the move" k="moveType" opts={options.moveType} req errors={errors} {...fieldProps("moveType")} />
                <div className="hidden sm:block" aria-hidden="true" />
                <Area label="Approximate inventory" k="inventory" hint="Main furniture and appliances, and roughly how many boxes." errors={errors} {...fieldProps("inventory")} />
                <Area label="Access considerations" k="access" hint="Stairs, lifts, parking distance, estate rules, items that need dismantling." errors={errors} {...fieldProps("access")} />
              </>
            )}
            {division === "transport-logistics" && (
              <>
                <Input label="Collection location" k="collection" req placeholder="e.g. Industrial Area, Enterprise Road" errors={errors} {...fieldProps("collection")} />
                <Input label="Delivery destination" k="delivery" req placeholder="e.g. Ruiru" errors={errors} {...fieldProps("delivery")} />
                <Area label="Description of goods" k="goods" req hint="What the goods are and how they are packed (cartons, pallets, loose)." errors={errors} {...fieldProps("goods")} />
                <Area label="Approximate quantity, weight or volume" k="quantity" req hint="e.g. 40 cartons, about 600kg, or 2 pallets." errors={errors} {...fieldProps("quantity")} />
                <Area label="Special handling requirements" k="handling" hint="Fragile items, loading help needed, delivery time windows." errors={errors} full {...fieldProps("handling")} />
              </>
            )}
            <div>
              <label htmlFor="f-preferredDate" className="block font-ui text-[0.95rem] font-medium text-ink">
                {division === "transport-logistics" ? "Preferred collection date" : division === "moving-relocation" ? "Preferred moving date" : "Preferred date"}
              </label>
              <input type="date" min={today} className={inputCls(!!errors.preferredDate)} {...fieldProps("preferredDate")} />
            </div>
          </div>
        </fieldset>
      )}

      {division && (
        <fieldset>
          <legend className="font-ui text-[1.1rem] font-semibold text-ink">3. Your contact details</legend>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <Input label="Full name" k="name" req autoComplete="name" errors={errors} {...fieldProps("name")} />
            <Input label="Phone number" k="phone" req type="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" errors={errors} {...fieldProps("phone")} />
            <Input label="Email (optional)" k="email" type="email" autoComplete="email" errors={errors} {...fieldProps("email")} />
            <div className="hidden sm:block" aria-hidden="true" />
            <Area label="Anything else we should know?" k="message" errors={errors} full {...fieldProps("message")} />
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="f-company">Company</label>
            <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mt-6">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (errors.consent) setErrors((er) => ({ ...er, consent: "" }));
                }}
                id="f-consent"
                aria-invalid={errors.consent ? true : undefined}
                aria-describedby={errors.consent ? "e-consent" : undefined}
                className="mt-1 h-5 w-5 shrink-0 rounded border-ink/30 accent-brand-700"
              />
              <span className="text-[0.95rem] leading-relaxed text-ink-soft">
                I agree that Cleantique Solutions may contact me by phone, WhatsApp or email about this request, as described in the{" "}
                <Link href="/privacy-policy/" className="font-medium text-brand-700 underline">privacy policy</Link>.
                <span aria-hidden="true" className="text-red-700"> *</span>
              </span>
            </label>
            {errors.consent && <p id="e-consent" className="mt-2 text-[0.92rem] text-red-800">{errors.consent}</p>}
          </div>

          {TURNSTILE_KEY && (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
              <div className="cf-turnstile mt-6" data-sitekey={TURNSTILE_KEY} />
            </>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-pill bg-sun px-7 py-3.5 font-ui text-[1.02rem] font-semibold text-ink hover:bg-sun-600 disabled:opacity-60"
            >
              {status === "sending" ? "Sending your request…" : "Send quote request"}
            </button>
            {division && (
              <a
                href={whatsappHref(waText)}
                target="_blank"
                rel="noopener"
                data-track="click_whatsapp"
                className="inline-flex items-center justify-center gap-2 rounded-pill border border-ink/15 bg-white px-6 py-3.5 font-ui font-semibold text-ink hover:border-[#25D366]"
              >
                <Icon name="whatsapp" className="h-5 w-5 text-[#1DA851]" /> Send these details on WhatsApp instead
              </a>
            )}
          </div>
          <p className="mt-4 text-[0.92rem] text-muted">
            Prefer to talk? Call <a href={telHref} className="font-medium text-brand-700 underline" data-track="click_call">{site.phoneDisplay}</a>.
          </p>
        </fieldset>
      )}
    </form>
  );
}

/* ---------- field primitives ---------- */

function inputCls(invalid: boolean) {
  return `mt-1.5 block w-full rounded-xl border bg-white px-4 py-3 text-[1rem] text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 ${
    invalid ? "border-red-500" : "border-ink/20"
  }`;
}

type BaseProps = {
  label: string;
  k: string;
  req?: boolean;
  errors: Errors;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function Label({ k, label, req }: { k: string; label: string; req?: boolean }) {
  return (
    <label htmlFor={`f-${k}`} className="block font-ui text-[0.95rem] font-medium text-ink">
      {label}
      {req && <span aria-hidden="true" className="text-red-700"> *</span>}
    </label>
  );
}

function Err({ k, errors }: { k: string; errors: Errors }) {
  return errors[k] ? <p id={`e-${k}`} className="mt-1.5 text-[0.92rem] text-red-800">{errors[k]}</p> : null;
}

function Input({ label, k, req, errors, type = "text", placeholder, autoComplete, ...rest }: BaseProps & { type?: string; placeholder?: string; autoComplete?: string }) {
  return (
    <div>
      <Label k={k} label={label} req={req} />
      <input type={type} placeholder={placeholder} autoComplete={autoComplete} required={req} className={inputCls(!!errors[k])} {...rest} />
      <Err k={k} errors={errors} />
    </div>
  );
}

function Select({ label, k, req, errors, opts, ...rest }: BaseProps & { opts: string[] }) {
  return (
    <div>
      <Label k={k} label={label} req={req} />
      <div className="relative">
        <select
          required={req}
          className={`${inputCls(!!errors[k])} cursor-pointer appearance-none pr-12 ${rest.value ? "" : "text-muted"}`}
          {...rest}
        >
          <option value="">Choose…</option>
          {opts.map((o) => (
            <option key={o} value={o} className="text-ink">{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1.5 flex w-11 items-center justify-center text-brand-700" aria-hidden="true">
          <Icon name="chevron" className="h-5 w-5 shrink-0" strokeWidth={2} />
        </span>
      </div>
      <Err k={k} errors={errors} />
    </div>
  );
}

function Area({ label, k, req, errors, hint, full, ...rest }: BaseProps & { hint?: string; full?: boolean }) {
  const hintId = hint ? `h-${k}` : undefined;
  const describedBy = [rest["aria-describedby"], hintId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label k={k} label={label} req={req} />
      {hint && <p id={hintId} className="mt-1 text-[0.9rem] text-muted">{hint}</p>}
      <textarea rows={3} required={req} className={inputCls(!!errors[k])} {...rest} aria-describedby={describedBy} />
      <Err k={k} errors={errors} />
    </div>
  );
}
