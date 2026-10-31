import Image from "next/image";
import Link from "next/link";
import EnquiryForm from "@/components/EnquiryForm";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { areasWithCounts, featuredProperties } from "@/lib/properties";

export default async function Home() {
  const [featured, areas] = await Promise.all([featuredProperties(6), areasWithCounts()]);

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image src="/photos/hero.jpg" alt="" fill preload sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/75" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-28 sm:pt-32 sm:pb-36 text-white">
          <p className="text-sand-200 text-sm font-semibold uppercase tracking-[0.2em]">Dubai real estate</p>
          <h1 className="font-display text-4xl sm:text-6xl leading-tight mt-3 max-w-3xl">Find a home that fits the way you live.</h1>
          <p className="mt-4 max-w-xl text-white/85">
            Apartments, villas and off-plan homes across Dubai, with honest prices and agents who answer the phone.
          </p>
          <div className="mt-8">
            <SearchBar areas={areas.map((a) => a.area)} />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sand-600 text-xs font-semibold uppercase tracking-[0.2em]">Featured</p>
            <h2 className="font-display text-3xl mt-1">Handpicked this week</h2>
          </div>
          <Link href="/properties" className="text-sm font-semibold underline underline-offset-4 hover:text-sand-600">
            All properties
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <PropertyCard key={p.slug} p={p} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* AREAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <p className="text-sand-600 text-xs font-semibold uppercase tracking-[0.2em]">Neighbourhoods</p>
        <h2 className="font-display text-3xl mt-1">Browse by area</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {areas.map((a) => (
            <Link
              key={a.area}
              href={`/properties?area=${encodeURIComponent(a.area)}`}
              className="rounded-full border border-sand-200 bg-white px-4 py-2 text-sm hover:border-sand-500 hover:text-sand-700"
            >
              {a.area} <span className="text-ink-soft">· {a.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY + CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-4 sm:px-6 mt-20 grid gap-10 lg:grid-cols-2 scroll-mt-24">
        <div>
          <p className="text-sand-600 text-xs font-semibold uppercase tracking-[0.2em]">Talk to us</p>
          <h2 className="font-display text-3xl mt-1">Not sure where to start?</h2>
          <p className="mt-3 text-ink-soft max-w-md">
            Tell us your budget and what matters to you. An agent will call you back with a shortlist, usually within the hour.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              ["Clear pricing", "Every listing shows size, service fees and handover dates up front."],
              ["Viewings that suit you", "Evenings and weekends, in person or by video call."],
              ["Mortgage help", "Pre-approval guidance and a monthly payment estimate on every sale listing."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sand-500" />
                <span>
                  <span className="font-semibold">{t}.</span> <span className="text-ink-soft">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <EnquiryForm />
      </section>
    </>
  );
}
