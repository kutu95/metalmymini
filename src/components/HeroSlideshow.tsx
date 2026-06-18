"use client";

import { useEffect, useState } from "react";

export type HeroSlide = {
  id: string;
  src: string;
  alt: string;
};

const ROTATION_MS = 2500;

export function HeroSlideshow({ images }: { images: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, ROTATION_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-copper/20 bg-stone-950">
        <p className="text-sm text-stone-500">Hero image coming soon</p>
      </div>
    );
  }

  if (images.length === 1) {
    const image = images[0];
    return (
      <img
        src={image.src}
        alt={image.alt}
        className="aspect-square w-full rounded-xl border border-copper/20 object-cover"
      />
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-copper/20 bg-stone-950">
      {images.map((image, i) => (
        <img
          key={image.id}
          src={image.src}
          alt={image.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {images.map((image, i) => (
          <span
            key={image.id}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-4 bg-copper-light" : "w-1.5 bg-stone-600"
            }`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
