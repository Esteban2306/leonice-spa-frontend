"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, ImageOff, Sparkle } from "lucide-react";

import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";
import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";
import { priceRangeLabel, productHref } from "@/src/features/products-catalog/lib/catalog-format";

interface ProductCardProps {
  product: CatalogProductCard;
  priority?: boolean;
  onQuickView: (product: CatalogProductCard) => void;
}

export function ProductCard({ product, priority = false, onQuickView }: ProductCardProps) {
  const glowRef = useSurfaceGlow<HTMLDivElement>();
  const price = priceRangeLabel(product.priceMinPesos, product.priceMaxPesos);
  const presentations = product.variants.map((variant) => variant.presentation).join(" · ");

  return (
    <article className="product-card group/card bezel lit-hover h-full">
      <div
        ref={glowRef}
        className="bezel-core glow lit relative flex h-full flex-col overflow-hidden bg-[#FDF8F1] [--lift:10px]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE3D0] min-[480px]:aspect-[4/5]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={`Foto de ${product.name}`}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="product-card-media object-contain p-6"
            />
          ) : (
            <div
              role="img"
              aria-label={`Sin imagen: foto de ${product.name}`}
              data-tone="light"
              className="product-card-media media-empty absolute inset-0 flex flex-col justify-end p-5 pb-16 [@media(hover:hover)_and_(pointer:fine)]:pb-5"
            >
              {product.brands.length > 0 && (
                <span className="font-heading text-3xl leading-none text-[#062112]/35">{product.brands.join(" · ")}</span>
              )}
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#BF9250]/60 px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                <ImageOff className="size-3" aria-hidden="true" />
                Sin foto
              </span>
            </div>
          )}
          <span aria-hidden="true" className="product-card-sheen" />

          {product.tags.length > 0 && (
            <ul className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5" aria-label="Necesidades">
              {product.tags.slice(0, 2).map((tag) => (
                <li
                  key={tag.slug}
                  className="rounded-full bg-[#FDF8F1]/90 px-2.5 py-1 font-sans text-[11px] font-bold text-[#062112] backdrop-blur-sm"
                >
                  {tag.name}
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="product-card-quick absolute inset-x-3 bottom-3 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#062112]/92 font-sans text-sm font-bold text-[#F2EBDB] backdrop-blur-md transition-colors hover:bg-[#062112] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0BC87]"
          >
            <Eye className="size-4" aria-hidden="true" />
            Vista rápida
            <span className="sr-only">de {product.name}</span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-sans text-lg font-bold leading-snug text-balance text-[#062112]">
              <Link
                href={productHref(product.slug)}
                className="rounded-sm after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BF9250]"
              >
                {product.name}
              </Link>
            </h2>
            {(product.tagline ?? product.purpose) && (
              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-[#062112]/70">
                {product.tagline ?? product.purpose}
              </p>
            )}
          </div>

          {product.benefits.length > 0 && (
            <ul className="flex flex-col gap-1" aria-label={`Cualidades de ${product.name}`}>
              {product.benefits.slice(0, 2).map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 font-sans text-sm text-[#062112]/80">
                  <Sparkle className="mt-0.5 size-3.5 shrink-0 text-[#BF9250]" strokeWidth={1.6} aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#BF9250]/25 pt-4">
            <div className="flex min-w-0 flex-col">
              {price && <span className="font-sans text-base font-bold tabular-nums text-[#062112]">{price}</span>}
              {presentations && (
                <span className="truncate font-sans text-xs tabular-nums text-[#062112]/70">{presentations}</span>
              )}
            </div>
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E0BC87] text-[#062112] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:bg-[#d4aa6a]"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
