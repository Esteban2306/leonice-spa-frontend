"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { MessageCircle } from "lucide-react";

import { MediaFrame } from "@/src/features/landing/components/media-frame";
import type { LandingProduct } from "@/src/features/landing/content/landing-content";
import { formatPesos } from "@/src/features/landing/lib/format";
import { whatsappHref } from "@/src/features/landing/lib/site-config";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";

interface ProductCardProps {
  product: LandingProduct;
  variant?: "shelf" | "compact";
  onSelect?: (product: LandingProduct) => void;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export function ProductCard({ product, variant = "shelf", onSelect }: ProductCardProps) {
  const reduced = useReducedMotion();
  const glowRef = useSurfaceGlow<HTMLElement>();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), SPRING);
  const compact = variant === "compact";

  const consultHref = whatsappHref(
    `Hola, quiero información del producto ${product.name}${product.line ? ` (${product.line})` : ""}.`,
  );

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || compact) return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      ref={glowRef}
      data-product-card
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={compact || reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={`glow lit lit-hover group/product flex flex-col overflow-hidden bg-[#EDE3D0] ${
        compact ? "rounded-[1.25rem]" : "rounded-[1.75rem]"
      }`}
    >
      <MediaFrame
        src={product.image}
        alt={product.name}
        hint={`Foto de ${product.name}`}
        compact={compact}
        sizes={compact ? "160px" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"}
        className={compact ? "relative aspect-[4/3]" : "relative aspect-[4/5]"}
        imageClassName="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/product:scale-[1.04]"
      >
        <span className="absolute left-3 top-3 rounded-full bg-[#FDF8F1]/90 px-2.5 py-1 font-sans text-[11px] font-bold tracking-[0.12em] text-[#062112] uppercase">
          {product.line}
        </span>
      </MediaFrame>

      <div className={`flex flex-1 flex-col ${compact ? "gap-1 p-3" : "gap-2 p-5"}`}>
        <h3
          className={`font-sans font-bold text-[#062112] text-pretty ${
            compact ? "text-sm leading-snug" : "text-lg leading-snug"
          }`}
        >
          {product.name}
        </h3>
        <p className={`font-sans text-[#5c4521] ${compact ? "text-xs" : "text-sm"}`}>
          {product.benefit}
          <span aria-hidden="true"> · </span>
          {product.priceCop !== null ? formatPesos(product.priceCop) : "Precio en tienda"}
        </p>

        {!compact && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            {consultHref ? (
              <a
                href={consultHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onSelect?.(product)}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-[#E0BC87] px-4 font-sans text-sm font-bold text-[#062112] transition-colors duration-300 hover:bg-[#062112] hover:text-[#F2EBDB]"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Consultar
              </a>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  );
}
