"use client";

import { useEffect, useRef, useState } from "react";

import { CarouselNext, CarouselPrevious, useCarousel } from "@/src/components/ui/carousel";

const ARROW =
  "static inset-auto my-0 size-11 translate-x-0 rotate-0 border-[#062112]/25 bg-transparent text-[#062112] transition-colors duration-300 hover:bg-[#062112] hover:text-[#F2EBDB] disabled:opacity-35";

export function ProductCarouselFooter() {
  const { api } = useCarousel();
  const fillRef = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState({ last: 0, total: 0, scrollable: false });

  useEffect(() => {
    if (!api) return;

    const perView = () => {
      const first = api.slideNodes()[0];
      if (!first) return 1;
      return Math.max(1, Math.round(api.rootNode().clientWidth / first.offsetWidth));
    };

    const paint = () => {
      const total = api.slideNodes().length;
      const visible = Math.min(perView(), total);
      const progress = Math.min(1, Math.max(0, api.scrollProgress()));
      const fraction = total > 0 ? (visible + progress * (total - visible)) / total : 1;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${fraction})`;
    };

    const measure = () => {
      const total = api.slideNodes().length;
      const visible = Math.min(perView(), total);
      const last = Math.min(total, api.selectedScrollSnap() + visible);
      setSeen({ last, total, scrollable: api.canScrollPrev() || api.canScrollNext() });
      paint();
    };

    measure();
    api.on("scroll", paint);
    api.on("select", measure);
    api.on("reInit", measure);
    api.on("resize", measure);

    return () => {
      api.off("scroll", paint);
      api.off("select", measure);
      api.off("reInit", measure);
      api.off("resize", measure);
    };
  }, [api]);

  const remaining = Math.max(0, seen.total - seen.last);
  const percent = seen.total > 0 ? Math.round((seen.last / seen.total) * 100) : 0;
  const status = remaining > 0 ? `faltan ${remaining}` : "viste todos";

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <div
          role="progressbar"
          aria-label="Avance del carrusel de productos"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={`${seen.last} de ${seen.total} productos vistos, ${status}`}
          className="relative h-2 w-full overflow-hidden rounded-full bg-[#062112]/12"
        >
          <span
            ref={fillRef}
            className="absolute inset-0 origin-left rounded-full bg-[#BF9250] will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className="font-sans text-sm text-[#062112]/70 tabular-nums" aria-hidden="true">
          <span className="font-bold text-[#062112]">
            {seen.last} de {seen.total}
          </span>{" "}
          productos · {status}
        </p>
      </div>
      {seen.scrollable && (
        <div className="flex shrink-0 items-center gap-2">
          <CarouselPrevious className={ARROW} />
          <CarouselNext className={ARROW} />
        </div>
      )}
    </div>
  );
}
