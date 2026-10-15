"use client";

import Link from "next/link";
import { ArrowUpRight, Eye, Sparkle } from "lucide-react";

import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";
import { priceRangeLabel, productHref } from "@/src/features/products-catalog/lib/catalog-format";

interface CatalogRowProps {
  product: CatalogProductCard;
  onHover: (product: CatalogProductCard | null) => void;
  onQuickView: (product: CatalogProductCard) => void;
}

export function CatalogRow({ product, onHover, onQuickView }: CatalogRowProps) {
  const price = priceRangeLabel(product.priceMinPesos, product.priceMaxPesos);
  const presentations = [product.category.name, ...product.variants.map((variant) => variant.presentation)].join(" · ");

  return (
    <article
      onPointerEnter={(event) => event.pointerType === "mouse" && onHover(product)}
      onPointerLeave={(event) => event.pointerType === "mouse" && onHover(null)}
      className="catalog-row group/row relative border-b border-[#BF9250]/25 py-6 sm:py-7"
    >
      <div className="grid gap-x-8 gap-y-2 desk:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto] desk:items-baseline">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-heading text-[clamp(1.875rem,3.6vw,3.25rem)] leading-[1.02] tracking-[-0.01em] text-[#062112]">
            <Link
              href={productHref(product.slug)}
              className="catalog-row-name rounded-sm pb-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BF9250]"
            >
              {product.name}
            </Link>
          </h2>
        </div>
        <p className="max-w-[46ch] font-sans text-[0.95rem] leading-relaxed text-pretty text-[#062112]/72">
          {product.tagline ?? product.purpose}
        </p>
        <div className="flex items-baseline gap-4 desk:flex-col desk:items-end desk:gap-1">
          {price && <span className="font-sans text-lg font-bold tabular-nums text-[#062112]">{price}</span>}
          {presentations && (
            <span className="font-sans text-xs tabular-nums text-[#062112]/55">{presentations}</span>
          )}
        </div>
      </div>

      <div className="catalog-row-detail">
        <div>
          <div className="flex flex-col gap-4 pt-5 desk:flex-row desk:items-end desk:justify-between">
            <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label={`Cualidades de ${product.name}`}>
              {product.benefits.slice(0, 3).map((benefit) => (
                <li key={benefit} className="inline-flex items-center gap-2 font-sans text-sm text-[#062112]/85">
                  <Sparkle className="size-3.5 shrink-0 text-[#BF9250]" strokeWidth={1.6} aria-hidden="true" />
                  {benefit}
                </li>
              ))}
              {product.howToUseCount > 0 && (
                <li className="inline-flex items-center gap-2 font-sans text-sm font-bold text-[#7a5a2c]">
                  Cómo usarlo en {product.howToUseCount} {product.howToUseCount === 1 ? "paso" : "pasos"}
                </li>
              )}
            </ul>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#062112]/20 px-4 font-sans text-sm font-bold text-[#062112] transition-[background-color,color,border-color] duration-300 hover:border-[#062112] hover:bg-[#062112] hover:text-[#F2EBDB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]"
              >
                <Eye className="size-4" aria-hidden="true" />
                Vista rápida
              </button>
              <Link
                href={productHref(product.slug)}
                aria-label={`Ver ${product.name}`}
                className="group/go grid size-10 place-items-center rounded-full bg-[#E0BC87] text-[#062112] transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#d4aa6a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]"
              >
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/go:-translate-y-0.5 group-hover/go:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
