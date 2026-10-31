import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Sandstone Realty — Homes for sale and rent in Dubai", template: "%s · Sandstone Realty" },
  description: "Apartments, villas and off-plan homes across Dubai. A demo real-estate website with listings, map search and an enquiry dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <div className="bg-ink text-sand-100 text-xs text-center px-4 py-1.5">
          Demo project with fictional listings — built by{" "}
          <a href="https://irfanmpmk.xyz" className="underline underline-offset-2 hover:text-white">
            Mohamed Irfan
          </a>
        </div>
        <header className="sticky top-0 z-[1000] bg-sand-50/90 backdrop-blur border-b border-sand-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-2xl tracking-tight">
              Sandstone<span className="text-sand-500">.</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link href="/properties?purpose=sale" className="hover:text-sand-600">Buy</Link>
              <Link href="/properties?purpose=rent" className="hover:text-sand-600">Rent</Link>
              <Link href="/properties?view=map" className="hidden sm:inline hover:text-sand-600">Map</Link>
              <Link href="/#contact" className="rounded-full bg-ink text-white px-4 py-2 hover:bg-ink/85">
                Contact
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-sand-200 mt-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-3 text-sm text-ink-soft">
            <div>
              <p className="font-display text-xl text-ink">Sandstone<span className="text-sand-500">.</span></p>
              <p className="mt-2">Homes for sale and rent across Dubai.</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-ink">Browse</p>
              <Link href="/properties?purpose=sale" className="block hover:text-ink">Properties for sale</Link>
              <Link href="/properties?purpose=rent" className="block hover:text-ink">Properties for rent</Link>
              <Link href="/properties?view=map" className="block hover:text-ink">Map search</Link>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-ink">About this demo</p>
              <p>Listings, agents and leads are fictional. Photos are free stock images.</p>
              <Link href="/admin" className="block hover:text-ink underline underline-offset-2">Agent dashboard (demo login)</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
