"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Link from "next/link";

export interface MapPin {
  slug: string;
  title: string;
  lat: number;
  lng: number;
  label: string; // short price, e.g. "AED 2.4M"
}

// Price labels instead of default marker images (which need extra asset setup).
const pinIcon = (label: string, active: boolean) =>
  L.divIcon({ className: "", html: `<span class="price-pin${active ? " active" : ""}">${label}</span>`, iconSize: [0, 0] });

export default function LeafletMap({ pins, zoom = 11, activeSlug }: { pins: MapPin[]; zoom?: number; activeSlug?: string }) {
  const center: [number, number] = pins.length
    ? [pins.reduce((s, p) => s + p.lat, 0) / pins.length, pins.reduce((s, p) => s + p.lng, 0) / pins.length]
    : [25.13, 55.22];
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pins.map((p) => (
        <Marker key={p.slug} position={[p.lat, p.lng]} icon={pinIcon(p.label, p.slug === activeSlug)}>
          <Popup>
            <Link href={`/properties/${p.slug}`} className="font-semibold">
              {p.title}
            </Link>
            <br />
            {p.label}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
