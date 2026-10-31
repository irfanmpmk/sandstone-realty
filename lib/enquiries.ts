import { connection } from "next/server";
import { getDb } from "./db";

export const STATUSES = ["new", "contacted", "viewing", "negotiating", "won", "lost"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  viewing: "Viewing booked",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

export interface Enquiry {
  id: number;
  property_id: number | null;
  property_title: string | null;
  property_slug: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_date: string | null;
  status: Status;
  notes: string;
  created_at: string;
  updated_at: string;
}

const SELECT = `
  SELECT e.id, e.property_id, p.title AS property_title, p.slug AS property_slug, e.name, e.phone, e.email,
         e.message, to_char(e.preferred_date, 'YYYY-MM-DD') AS preferred_date, e.status, e.notes,
         e.created_at::text AS created_at, e.updated_at::text AS updated_at
  FROM enquiries e LEFT JOIN properties p ON p.id = e.property_id`;

export interface NewEnquiry {
  propertyId: number | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferredDate: string | null;
}

export async function createEnquiry(e: NewEnquiry) {
  const db = await getDb();
  await db.query(
    `INSERT INTO enquiries (property_id, name, phone, email, message, preferred_date)
     VALUES ((SELECT id FROM properties WHERE id = $1), $2, $3, $4, $5, $6)`,
    [e.propertyId, e.name, e.phone, e.email, e.message, e.preferredDate],
  );
}

export async function listEnquiries(status?: string): Promise<Enquiry[]> {
  await connection();
  const db = await getDb();
  const valid = (STATUSES as readonly string[]).includes(status ?? "");
  return db.query<Enquiry>(
    `${SELECT} ${valid ? "WHERE e.status = $1" : ""} ORDER BY e.created_at DESC LIMIT 200`,
    valid ? [status] : [],
  );
}

export async function getEnquiry(id: number): Promise<Enquiry | undefined> {
  await connection();
  const db = await getDb();
  const [row] = await db.query<Enquiry>(`${SELECT} WHERE e.id = $1`, [id]);
  return row;
}

export async function updateEnquiry(id: number, status: Status, note: string) {
  const db = await getDb();
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");
  await db.query(
    `UPDATE enquiries
     SET status = $2,
         notes = CASE WHEN $3::text = '' THEN notes ELSE trim(notes || E'\\n' || $4::text || ' - ' || $3::text) END,
         updated_at = now()
     WHERE id = $1`,
    [id, status, note, stamp],
  );
}

export async function enquiryStats() {
  await connection();
  const db = await getDb();
  const [counts] = await db.query<{ total: number; new: number; week: number; viewing: number; won: number; closed: number }>(`
    SELECT COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE status = 'new')::int AS new,
           COUNT(*) FILTER (WHERE created_at > now() - interval '7 days')::int AS week,
           COUNT(*) FILTER (WHERE status = 'viewing')::int AS viewing,
           COUNT(*) FILTER (WHERE status = 'won')::int AS won,
           COUNT(*) FILTER (WHERE status IN ('won', 'lost'))::int AS closed
    FROM enquiries`);
  const byStatus = await db.query<{ status: Status; count: number }>(
    "SELECT status, COUNT(*)::int AS count FROM enquiries GROUP BY status",
  );
  const topProperties = await db.query<{ title: string; slug: string; count: number }>(`
    SELECT p.title, p.slug, COUNT(*)::int AS count
    FROM enquiries e JOIN properties p ON p.id = e.property_id
    GROUP BY p.id ORDER BY count DESC, p.title LIMIT 5`);
  return { ...counts, byStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.count])), topProperties };
}
