import type { Metadata } from "next";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { areasWithCounts, listProperties, type PropertyFilters } from "@/lib/properties";
import { shortPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Properties" };

const PRICE_STEPS: Record<string, number[]> = {
  sale: [500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000],
  rent: [50_000, 80_000, 120_000, 200_000, 300_000],
};

const field = "rounded-xl border border-sand-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-sand-500";

export default async function PropertiesPage({ searchParams }: PageProps<"/properties">) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filters: PropertyFilters = {
    purpose: get("purpose"),
    type: get("type"),
    area: get("area"),
    beds: get("beds"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    sort: get("sort"),
  };
  const view = get("view") === "map" ? "map" : "list";
  const [results, areas] = await Promise.all([listProperties(filters), areasWithCounts()]);
  const steps = PRICE_STEPS[filters.purpose === "rent" ? "rent" : "sale"];

  const heading =
    filters.purpose === "rent" ? "Properties for rent" : filters.purpose === "sale" ? "Properties for sale" : "All properties";
  const viewHref = (v: string) => {
    const q = new URLSearchParams(Object.entries({ ...filters, view: v }).filter(([, val]) => val) as [string, string][]);
    return `/properties?${q}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
      <h1 className="font-display text-3xl sm:text-4xl">
        {heading}
        {filters.area && <span className="text-sand-600"> in {filters.area}</span>}
      </h1>

      {/* Filters: a GET form, so every search is a shareable URL */}
      <form className="mt-6 grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
        <input type="hidden" name="view" value={view} />
        <select name="purpose" defaultValue={filters.purpose} className={field} aria-label="Buy or rent">
          <option value="">Buy or rent</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <select name="area" defaultValue={filters.area} className={field} aria-label="Area">
          <option value="">All areas</option>
          {areas.map((a) => (
            <option key={a.area}>{a.area}</option>
          ))}
        </select>
        <select name="type" defaultValue={filters.type} className={field} aria-label="Type">
          <option value="">Any type</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="townhouse">Townhouse</option>
          <option value="penthouse">Penthouse</option>
        </select>
        <select name="beds" defaultValue={filters.beds} className={field} aria-label="Bedrooms">
          <option value="">Any beds</option>
          <option value="0">Studio</option>
          <option value="1">1 bed</option>
          <option value="2">2 beds</option>
          <option value="3">3 beds</option>
          <option value="4">4+ beds</option>
        </select>
        <select name="maxPrice" defaultValue={filters.maxPrice} className={field} aria-label="Max price">
          <option value="">Any price</option>
          {steps.map((s) => (
            <option key={s} value={s}>
              Up to {shortPrice(s, filters.purpose === "rent" ? "rent" : "sale")}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={filters.sort} className={field} aria-label="Sort">
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="size">Largest first</option>
        </select>
        <button className="rounded-xl bg-ink text-white text-sm font-semibold px-4 py-2.5 hover:bg-ink/85">Apply</button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm">
        <p className="text-ink-soft">
          {results.length} {results.length === 1 ? "property" : "properties"}
          {(filters.purpose || filters.area || filters.type || filters.beds || filters.maxPrice) && (
            <>
              {" · "}
              <Link href={`/properties?view=${view}`} className="underline underline-offset-2 hover:text-ink">
                Clear filters
              </Link>
            </>
          )}
        </p>
        <div className="inline-flex rounded-full border border-sand-200 bg-white p-1">
          {(["list", "map"] as const).map((v) => (
            <Link
              key={v}
              href={viewHref(v)}
              className={`rounded-full px-4 py-1.5 capitalize ${view === v ? "bg-ink text-white" : "text-ink-soft hover:text-ink"}`}
            >
              {v}
            </Link>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand-200 p-10 text-center text-ink-soft">
          No properties match these filters. Try a wider price range or another area.
        </div>
      ) : view === "map" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <PropertyMap
            className="h-[60vh] lg:h-[75vh] lg:sticky lg:top-24"
            pins={results.map((p) => ({ slug: p.slug, title: p.title, lat: p.lat, lng: p.lng, label: shortPrice(p.price, p.purpose) }))}
          />
          <div className="grid gap-6">
            {results.map((p) => (
              <PropertyCard key={p.slug} p={p} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <PropertyCard key={p.slug} p={p} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
