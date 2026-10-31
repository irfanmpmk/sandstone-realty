import { connection } from "next/server";
import { getDb } from "./db";

export interface Property {
  id: number;
  slug: string;
  title: string;
  purpose: "sale" | "rent";
  type: string;
  area: string;
  price: number;
  beds: number;
  baths: number;
  size_sqft: number;
  furnished: boolean;
  completion: string | null;
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  images: string[];
  agent: string;
  featured: boolean;
}

export interface PropertyFilters {
  purpose?: string;
  type?: string;
  area?: string;
  beds?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

export const TYPES = ["apartment", "villa", "townhouse", "penthouse"] as const;

const SORTS: Record<string, string> = {
  newest: "created_at DESC, id DESC",
  "price-asc": "price ASC",
  "price-desc": "price DESC",
  size: "size_sqft DESC",
};

// Builds a parameterised WHERE clause from untrusted query-string values.
export async function listProperties(f: PropertyFilters = {}): Promise<Property[]> {
  await connection();
  const where: string[] = [];
  const args: unknown[] = [];
  const add = (sql: string, value: unknown) => {
    args.push(value);
    where.push(sql.replace("?", `$${args.length}`));
  };
  if (f.purpose === "sale" || f.purpose === "rent") add("purpose = ?", f.purpose);
  if (f.type && (TYPES as readonly string[]).includes(f.type)) add("type = ?", f.type);
  if (f.area) add("area = ?", f.area);
  const beds = Number(f.beds);
  if (f.beds && Number.isInteger(beds)) add(beds >= 4 ? "beds >= ?" : "beds = ?", beds);
  const min = Number(f.minPrice);
  if (f.minPrice && min > 0) add("price >= ?", min);
  const max = Number(f.maxPrice);
  if (f.maxPrice && max > 0) add("price <= ?", max);

  const db = await getDb();
  return db.query<Property>(
    `SELECT * FROM properties ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY ${SORTS[f.sort ?? ""] ?? SORTS.newest}`,
    args,
  );
}

export async function getProperty(slug: string): Promise<Property | undefined> {
  await connection();
  const db = await getDb();
  const [row] = await db.query<Property>("SELECT * FROM properties WHERE slug = $1", [slug]);
  return row;
}

export async function featuredProperties(limit = 6): Promise<Property[]> {
  await connection();
  const db = await getDb();
  return db.query<Property>("SELECT * FROM properties WHERE featured ORDER BY price DESC LIMIT $1", [limit]);
}

export async function similarProperties(p: Property, limit = 3): Promise<Property[]> {
  const db = await getDb();
  return db.query<Property>(
    `SELECT * FROM properties WHERE id <> $1 AND purpose = $2
     ORDER BY (area = $3) DESC, abs(price - $4) LIMIT $5`,
    [p.id, p.purpose, p.area, p.price, limit],
  );
}

export async function areasWithCounts(): Promise<{ area: string; count: number }[]> {
  await connection();
  const db = await getDb();
  return db.query("SELECT area, COUNT(*)::int AS count FROM properties GROUP BY area ORDER BY count DESC, area");
}
