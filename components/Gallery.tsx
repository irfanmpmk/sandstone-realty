"use client";

import Image from "next/image";
import { useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-sand-100">
        <Image src={images[active]} alt={`${title}, photo ${active + 1}`} fill preload sizes="(min-width: 1024px) 720px, 100vw" className="object-cover" />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 text-white text-xs px-2.5 py-1">
          {active + 1} / {images.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}`}
            className={`relative aspect-[16/10] rounded-xl overflow-hidden ring-2 transition ${i === active ? "ring-sand-500" : "ring-transparent opacity-80 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="240px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
