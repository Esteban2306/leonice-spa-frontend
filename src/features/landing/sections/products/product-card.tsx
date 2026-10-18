"use client";

import Link from "next/link";

import { MediaFrame } from "@/src/features/landing/components/media-frame";
import { landingProductHref } from "@/src/features/landing/lib/catalog-links";
import type { LandingProduct, LandingProductVariant } from "@/src/features/landing/content/landing-content";
import { formatPesos } from "@/src/features/landing/lib/format";
import { SECTION_IDS, whatsappHref } from "@/src/features/landing/lib/site-config";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";

function priceLabel(variants: LandingProductVariant[]) {
  const prices = variants
    .map((variant) => variant.pricePesos)
    .filter((price): price is number => price !== null);
  if (prices.length === 0) return "Precio en tienda";
  const lowest = Math.min(...prices);
  const varies = prices.some((price) => price !== lowest);
  return varies ? `Desde ${formatPesos(lowest)}` : formatPesos(lowest);
}

function metaLine(variants: LandingProductVariant[]) {
  const brands = [...new Set(variants.map((variant) => variant.brand).filter(Boolean))];
  const presentations = variants.map((variant) => variant.presentation).filter(Boolean);
  return [...brands, ...presentations].join(" · ");
}

interface ProductCardProps {
  product: LandingProduct;
  variant?: "shelf" | "compact";
  dense?: boolean;
}

export function ProductCard({ product, variant = "shelf", dense = false }: ProductCardProps) {
  const glowRef = useSurfaceGlow<HTMLElement>();
  const price = priceLabel(product.variants);
  const image = product.image ?? product.variants.find((item) => item.imageUrl)?.imageUrl ?? null;

  if (variant === "compact") {
    return (
      <article ref={glowRef} className="glow flex flex-col overflow-hidden rounded-[1.25rem] bg-[#E6DFD0]">
        <MediaFrame
          src={image}
          alt={product.name}
          hint={`Foto de ${product.name}`}
          compact
          sizes="160px"
          className="relative aspect-[4/3]"
          imageClassName="!object-contain p-3"
        />
        <div className="flex flex-col gap-1 p-3">
          <h3 className="font-sans text-sm font-bold leading-snug text-[#062112] text-pretty">{product.name}</h3>
          <p className="font-sans text-xs font-bold text-[#7a5a2c] tabular-nums">{price}</p>
        </div>
      </article>
    );
  }

  const benefits = product.tags.join(" · ");
  const meta = metaLine(product.variants);
  const brands = [...new Set(product.variants.map((item) => item.brand).filter(Boolean))];
  const consultHref =
    whatsappHref(
      `Hola, quiero información del producto ${product.name}${brands.length ? ` (${brands.join(", ")})` : ""}.`,
    ) ?? `#${SECTION_IDS.contact}`;
  const external = consultHref.startsWith("http");

  return (
    <article
      ref={glowRef}
      data-product-card
      className="glow group/product flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[#E6DFD0] text-[#062112]"
    >
      <div className="relative min-h-0 flex-1">
        <MediaFrame
          src={image}
          alt={product.name}
          hint={`Foto de ${product.name}`}
          compact
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80vw"
          className="absolute inset-0"
          imageClassName="!object-contain p-6 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/product:scale-[1.04]"
        />
        {product.categoryName && (
          <span className="absolute left-4 top-4 rounded-full bg-[#FDF8F1]/90 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#062112]">
            {product.categoryName}
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 px-6 pb-6 pt-4">
        <h3 className="line-clamp-2 min-h-[3.125rem] font-sans text-xl font-bold leading-tight text-[#062112] text-balance">
          <Link
            href={landingProductHref(product)}
            className="underline-offset-[6px] transition-colors hover:underline hover:decoration-[#BF9250] hover:decoration-2"
          >
            {product.name}
          </Link>
        </h3>
        <p className="font-sans text-lg font-bold text-[#7a5a2c] tabular-nums">{price}</p>
        {benefits && <p className="font-sans text-[0.95rem] text-[#062112]/65">{benefits}</p>}
        {meta && (
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#062112]/70">{meta}</p>
        )}
        {!dense && (
          <div className="min-h-[2.85rem]">
            {product.description && (
              <p className="line-clamp-2 font-sans text-sm leading-relaxed text-[#062112]/70">{product.description}</p>
            )}
          </div>
        )}
        <a
          href={consultHref}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-2 inline-flex h-11 w-fit items-center rounded-full bg-[#E0BC87] px-6 font-sans text-[0.95rem] font-bold text-[#062112] transition-colors duration-300 hover:bg-[#d4aa6a]"
        >
          Consultar
        </a>
        <Link
          href={landingProductHref(product)}
          className="w-fit font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
        >
          Cómo se usa
        </Link>
      </div>
    </article>
  );
}
