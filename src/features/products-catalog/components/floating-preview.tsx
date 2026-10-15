"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";

const LERP = 0.18;
const OFFSET_X = 24;
const OFFSET_Y = -268;

export function FloatingPreview({ product }: { product: CatalogProductCard | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled.current) return;

    const tick = () => {
      const node = ref.current;
      if (!node) return;
      position.current.x += (target.current.x - position.current.x) * LERP;
      position.current.y += (target.current.y - position.current.y) * LERP;
      node.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      const settled =
        Math.abs(target.current.x - position.current.x) < 0.3 &&
        Math.abs(target.current.y - position.current.y) < 0.3;
      frame.current = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      target.current = { x: event.clientX + OFFSET_X, y: event.clientY + OFFSET_Y };
      if (!frame.current) frame.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  useEffect(() => {
    if (product) position.current = { ...target.current };
  }, [product]);

  return (
    <div ref={ref} aria-hidden="true" data-visible={product !== null} className="catalog-floating hidden desk:block">
      <div className="bezel w-52">
        <div className="bezel-core relative aspect-[4/5] overflow-hidden bg-[#F2EBDB] shadow-[calc(var(--sun-dx,0.8)*14px)_calc(var(--sun-dy,0.4)*14px)_32px_-10px_rgb(74_46_16/0.4)]">
          {product?.imageUrl ? (
            <Image src={product.imageUrl} alt="" fill sizes="208px" className="object-cover" />
          ) : (
            <div data-tone="light" className="media-empty absolute inset-0 flex flex-col justify-between p-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#BF9250]/60 px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                <ImageOff className="size-3" />
                Sin foto
              </span>
              {product && (
                <span className="flex flex-col gap-1">
                  {product.brands.length > 0 && (
                    <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                      {product.brands.join(" · ")}
                    </span>
                  )}
                  <span className="font-heading text-2xl leading-tight text-[#062112]">{product.name}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
