import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import Gallery from "@/components/Gallery";
import MortgageCalculator from "@/components/MortgageCalculator";
import PropertyCard, { Badge } from "@/components/PropertyCard";
import PropertyMap from "@/components/PropertyMap";
import { capitalize, formatBeds, formatPrice, formatSize, shortPrice, whatsappLink } from "@/lib/format";
import { getProperty, similarProperties } from "@/lib/properties";

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const p = await getProperty((await params).slug);
  if (!p) return { title: "Property not found" };
  return {
    title: `${p.title}, ${p.area}`,
    description: `${formatPrice(p.price, p.purpose)} · ${formatBeds(p.beds)} · ${formatSize(p.size_sqft)}. ${p.description.slice(0, 120)}`,
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const p = await getProperty((await params).slug);
  if (!p) notFound();
  const similar = await similarProperties(p);

  const facts = [
    ["Price", formatPrice(p.price, p.purpose)],
    ["Type", capitalize(p.type)],
    ["Bedrooms", formatBeds(p.beds)],
    ["Bathrooms", String(p.baths)],
    ["Size", formatSize(p.size_sqft)],
    ["Price / sq ft", p.purpose === "sale" ? `AED ${Math.round(p.price / p.size_sqft).toLocaleString("en-AE")}` : "—"],
    ["Furnishing", p.furnished ? "Furnished" : "Unfurnished"],
    ["Status", p.completion ? `Off-plan, handover ${p.completion}` : "Ready"],
  ];
  const waText = `Hi, I'm interested in "${p.title}" (${formatPrice(p.price, p.purpose)}) in ${p.area}.`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      <nav className="text-xs text-ink-soft">
        <Link href="/properties" className="hover:text-ink">Properties</Link>
        {" / "}
        <Link href={`/properties?area=${encodeURIComponent(p.area)}`} className="hover:text-ink">{p.area}</Link>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex gap-2 mb-2">
            <Badge tone={p.purpose === "rent" ? "dark" : "light"}>{p.purpose === "rent" ? "For rent" : "For sale"}</Badge>
            {p.completion && <Badge tone="gold">Off-plan · {p.completion}</Badge>}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl">{p.title}</h1>
          <p className="text-ink-soft mt-1">{p.area}, Dubai</p>
        </div>
        <p className="text-2xl sm:text-3xl font-semibold">{formatPrice(p.price, p.purpose)}</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10 min-w-0">
          <Gallery images={p.images} title={p.title} />

          <section>
            <h2 className="font-display text-2xl">Key facts</h2>
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-sand-200 bg-sand-200">
              {facts.map(([k, v]) => (
                <div key={k} className="bg-white p-4">
                  <dt className="text-xs text-ink-soft">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-display text-2xl">About this home</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{p.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {p.amenities.map((a) => (
                <li key={a} className="rounded-full bg-sand-100 px-3 py-1.5 text-sm">{a}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl">Location</h2>
            <PropertyMap
              className="h-80 mt-4"
              zoom={13}
              activeSlug={p.slug}
              pins={[{ slug: p.slug, title: p.title, lat: p.lat, lng: p.lng, label: shortPrice(p.price, p.purpose) }]}
            />
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl bg-white border border-sand-200 p-5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-sand-200 grid place-items-center font-semibold text-sand-700">
              {p.agent.split(" ").map((w) => w[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{p.agent}</p>
              <p className="text-xs text-ink-soft">Listing agent</p>
            </div>
            <a
              href={whatsappLink(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] text-white text-sm font-semibold px-4 py-2 hover:brightness-110"
            >
              WhatsApp
            </a>
          </div>
          <EnquiryForm propertyId={p.id} propertyTitle={p.title} />
          {p.purpose === "sale" && <MortgageCalculator price={p.price} />}
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">Similar properties</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.slug} p={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
