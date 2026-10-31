import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties";
import { capitalize, formatBeds, formatPrice, formatSize } from "@/lib/format";

export function Badge({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" | "gold" }) {
  const tones = {
    light: "bg-white/90 text-ink",
    dark: "bg-ink text-white",
    gold: "bg-sand-500 text-white",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export default function PropertyCard({ p, priority = false }: { p: Property; priority?: boolean }) {
  return (
    <Link
      href={`/properties/${p.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-sand-200 hover:shadow-lg hover:-translate-y-0.5 transition"
    >
      <div className="relative aspect-[4/3] bg-sand-100">
        {p.images[0] && (
          <Image
            src={p.images[0]}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover group-hover:scale-[1.03] transition duration-500"
            preload={priority}
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone={p.purpose === "rent" ? "dark" : "light"}>{p.purpose === "rent" ? "For rent" : "For sale"}</Badge>
          {p.completion && <Badge tone="gold">Off-plan · {p.completion}</Badge>}
        </div>
      </div>
      <div className="p-4 space-y-1.5">
        <p className="text-lg font-semibold">{formatPrice(p.price, p.purpose)}</p>
        <p className="text-sm text-ink line-clamp-1">{p.title}</p>
        <p className="text-xs text-ink-soft">
          {capitalize(p.type)} · {formatBeds(p.beds)} · {p.baths} bath{p.baths === 1 ? "" : "s"} · {formatSize(p.size_sqft)}
        </p>
        <p className="text-xs font-medium text-sand-700">{p.area}</p>
      </div>
    </Link>
  );
}
