"use client";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageCarousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2500 })]);

  const [fullscreen, setFullscreen] = useState<string | null>(null);
  useEffect(() => {
    if (!emblaApi) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.deltaY < 0) emblaApi.scrollPrev();
      else if (event.deltaY > 0) emblaApi.scrollNext();
    };
    emblaApi.containerNode().addEventListener("wheel", onWheel);
    return () => emblaApi.containerNode().removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      setFullscreen(null);
    } else if (event.key === "ArrowLeft") {
      emblaApi?.scrollPrev();
    } else if (event.key === "ArrowRight") {
      emblaApi?.scrollNext();
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [emblaApi]);
  return (
    <>
      <div className="relative w-full max-w-2xl">
        <div className="overflow-hidden px-4" ref={emblaRef}>
          <div className="flex gap-4">
            {images.map((url) => (
              <div
                key={url}
                className="flex-none w-4/5 relative aspect-square cursor-zoom-in rounded-lg overflow-hidden"
                onClick={() => setFullscreen(url)}
              >
                <Image
                  src={url}
                  fill
                  sizes="(max-width: 576px) 100vw, 576px"
                  loading="eager"
                  className="object-contain"
                  alt=""
                />
                <p className=" text-center text-2xl font-bold dark:text-gray-400 mt-2">
                  {url.split("/").pop()}
                </p>
              </div>
            ))}
          </div>
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
