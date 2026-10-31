import { Pool } from "pg";
import { seedProperties, seedEnquiries } from "./seed-data";

// One SQL dialect everywhere: Postgres on Neon when DATABASE_URL is set,
// and PGlite (Postgres in WebAssembly, stored in .pglite/) for local development.
type Params = unknown[];
export interface Db {
  query<T = Record<string, unknown>>(sql: string, params?: Params): Promise<T[]>;
  /** Runs several statements without parameters (schema setup). */
  exec(sql: string): Promise<void>;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('sale', 'rent')),
    type TEXT NOT NULL,
    area TEXT NOT NULL,
    price INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    baths INTEGER NOT NULL,
    size_sqft INTEGER NOT NULL,
    furnished BOOLEAN NOT NULL DEFAULT false,
    completion TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    description TEXT NOT NULL,
    amenities TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    agent TEXT NOT NULL,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL DEFAULT '',
    preferred_date DATE,
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS enquiries_status ON enquiries (status, created_at DESC);
`;

async function connect(): Promise<Db> {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
    return {
      query: async (sql, params) => (await pool.query(sql, params)).rows,
      exec: async (sql) => void (await pool.query(sql)),
    };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const pg = new PGlite(process.env.PGLITE_DIR || ".pglite");
  return {
    query: async <T,>(sql: string, params?: Params) => (await pg.query<T>(sql, params)).rows,
    exec: async (sql: string) => void (await pg.exec(sql)),
  };
}

/** Inserts the demo listings and enquiries. Used on first start and by "Reset demo data". */
export async function seed(db: Db, { enquiriesOnly = false } = {}) {
  if (!enquiriesOnly) {
    for (const p of seedProperties) {
      await db.query(
        `INSERT INTO properties (slug, title, purpose, type, area, price, beds, baths, size_sqft, furnished,
           completion, lat, lng, description, amenities, images, agent, featured)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (slug) DO NOTHING`,
        [p.slug, p.title, p.purpose, p.type, p.area, p.price, p.beds, p.baths, p.sizeSqft, p.furnished,
          p.completion, p.lat, p.lng, p.description, p.amenities, p.images, p.agent, p.featured],
      );
    }
  }
  for (const e of seedEnquiries) {
    await db.query(
      `INSERT INTO enquiries (property_id, name, phone, email, message, preferred_date, status, notes, created_at, updated_at)
       VALUES ((SELECT id FROM properties WHERE slug = $1), $2, $3, $4, $5,
               CASE WHEN $6::int IS NULL THEN NULL ELSE current_date + $6::int END,
               $7, $8, now() - make_interval(hours => $9::int), now() - make_interval(hours => $9::int))`,
      [e.property, e.name, e.phone, e.email, e.message, e.viewingInDays, e.status, e.notes, e.hoursAgo],
    );
  }
}

async function init(): Promise<Db> {
  const db = await connect();
  await db.exec(SCHEMA);
  const [{ n }] = await db.query<{ n: number }>("SELECT COUNT(*)::int AS n FROM properties");
  if (n === 0) await seed(db);
  return db;
}

// Reuse one connection across hot reloads and requests in the same process.
const g = globalThis as unknown as { __db?: Promise<Db> };
export function getDb(): Promise<Db> {
  g.__db ??= init().catch((err) => {
    g.__db = undefined;
    throw err;
  });
  return g.__db;
}
