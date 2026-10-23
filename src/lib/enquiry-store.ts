import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

/**
 * Enquiry storage.
 * - Production: PostgreSQL via DATABASE_URL (Neon, Supabase, Vercel Postgres, Railway, etc.).
 * - Local development without a database: a JSON file in ./.data/ (git-ignored).
 * The table is created automatically on first use.
 */

export type EnquiryStatus = "new" | "contacted" | "quoted" | "booked" | "closed" | "spam";
export const STATUSES: EnquiryStatus[] = ["new", "contacted", "quoted", "booked", "closed", "spam"];

export type StoredEnquiry = {
  id: string;
  createdAt: string;
  division: string;
  name: string;
  phone: string;
  email: string;
  details: Record<string, string>;
  status: EnquiryStatus;
  sourcePage: string;
  notes: string;
};

let sql: ReturnType<typeof postgres> | null = null;
let ready = false;

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) sql = postgres(url, { ssl: url.includes("localhost") ? false : "require", max: 3, idle_timeout: 20, prepare: false });
  return sql;
}

async function ensureTable() {
  const s = db();
  if (!s || ready) return;
  await s`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      division TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      details JSONB NOT NULL DEFAULT '{}'::jsonb,
      status TEXT NOT NULL DEFAULT 'new',
      source_page TEXT NOT NULL DEFAULT '',
      notes TEXT NOT NULL DEFAULT ''
    )`;
  ready = true;
}

const FILE = path.join(process.cwd(), ".data", "enquiries.json");

async function readFile(): Promise<StoredEnquiry[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeFile(rows: StoredEnquiry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}

export function newEnquiryId() {
  const d = new Date();
  const stamp = `${d.getUTCFullYear().toString().slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CT-${stamp}-${rand}`;
}

export async function saveEnquiry(e: Omit<StoredEnquiry, "createdAt" | "status" | "notes">) {
  const s = db();
  if (s) {
    await ensureTable();
    await s`INSERT INTO enquiries (id, division, name, phone, email, details, source_page)
            VALUES (${e.id}, ${e.division}, ${e.name}, ${e.phone}, ${e.email}, ${s.json(e.details)}, ${e.sourcePage})`;
    return "database";
  }
  if (process.env.VERCEL) throw new Error("DATABASE_URL is not configured");
  const rows = await readFile();
  rows.unshift({ ...e, createdAt: new Date().toISOString(), status: "new", notes: "" });
  await writeFile(rows);
  return "file";
}

export async function listEnquiries(limit = 500): Promise<StoredEnquiry[]> {
  const s = db();
  if (s) {
    await ensureTable();
    const rows = await s`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT ${limit}`;
    return rows.map((r) => ({
      id: r.id,
      createdAt: new Date(r.created_at).toISOString(),
      division: r.division,
      name: r.name,
      phone: r.phone,
      email: r.email,
      details: r.details,
      status: r.status,
      sourcePage: r.source_page,
      notes: r.notes,
    }));
  }
  return (await readFile()).slice(0, limit);
}

export async function updateEnquiry(id: string, patch: { status?: EnquiryStatus; notes?: string }) {
  const s = db();
  if (s) {
    await ensureTable();
    if (patch.status) await s`UPDATE enquiries SET status = ${patch.status} WHERE id = ${id}`;
    if (patch.notes !== undefined) await s`UPDATE enquiries SET notes = ${patch.notes} WHERE id = ${id}`;
    return;
  }
  const rows = await readFile();
  const row = rows.find((r) => r.id === id);
  if (row) {
    if (patch.status) row.status = patch.status;
    if (patch.notes !== undefined) row.notes = patch.notes;
    await writeFile(rows);
  }
}

export function storageConfigured() {
  return Boolean(process.env.DATABASE_URL) || !process.env.VERCEL;
}
