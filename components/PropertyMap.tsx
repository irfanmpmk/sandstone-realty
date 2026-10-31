"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./LeafletMap";

// Leaflet touches `window`, so the map only renders in the browser.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-sand-100" />,
});

export type { MapPin };

export default function PropertyMap(props: { pins: MapPin[]; zoom?: number; activeSlug?: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-sand-200 ${props.className ?? "h-96"}`}>
      <LeafletMap {...props} />
    </div>
  );
}
