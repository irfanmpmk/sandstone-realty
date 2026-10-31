const aed = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

export const formatPrice = (price: number, purpose: "sale" | "rent") =>
  `AED ${aed.format(price)}${purpose === "rent" ? " / year" : ""}`;

export const formatBeds = (beds: number) => (beds === 0 ? "Studio" : `${beds} bed${beds > 1 ? "s" : ""}`);

export const formatSize = (sqft: number) => `${aed.format(sqft)} sq ft`;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(value: string) {
  const mins = Math.round((Date.now() - new Date(value).getTime()) / 60_000);
  if (mins < 60) return `${Math.max(mins, 1)} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

// wa.me with a number opens that chat; without one it opens WhatsApp's share sheet.
export function whatsappLink(text: string, number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) {
  const digits = (number ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/** Compact price for map pins: "AED 2.35M", "AED 95K/yr". */
export function shortPrice(price: number, purpose: "sale" | "rent") {
  const v = price >= 1_000_000 ? `${+(price / 1_000_000).toFixed(2)}M` : `${Math.round(price / 1000)}K`;
  return `AED ${v}${purpose === "rent" ? "/yr" : ""}`;
}
