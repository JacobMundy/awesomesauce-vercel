"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [fullscreen, setFullscreen] = useState<string | null>(null);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setFullscreen(null);
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });
  return (
    <>
<div className="h-[500px] w-full max-w-5xl overflow-y-auto overflow-x-hidden">
  <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
    {images.map((url) => (
      <div key={url}>
        <div
          className="relative aspect-square cursor-zoom-in rounded-lg"
          onClick={() => setFullscreen(url)}
        >
          <Image
            src={url}
            fill
            sizes="(max-width: 576px) 50vw, 288px"
            loading="eager"
            className="object-contain"
            alt=""
          />
        </div>
        <p className="mt-2 text-center text-xl font-bold dark:text-gray-200">
          {url.split("/").pop()}
        </p>
      </div>
    ))}
  </div>
</div>
      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullscreen(null)}
        >
          <div className="relative w-screen h-screen p-8">
            <Image
              src={fullscreen}
              fill
              sizes="100vw"
              className="object-contain"
              alt=""
            />
          </div>
          <button className="absolute top-4 right-4 text-white text-2xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/80">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
