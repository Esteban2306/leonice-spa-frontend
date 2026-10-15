import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/src/features/landing/components/reveal";
import { formatPesos } from "@/src/features/landing/lib/format";
import { PRODUCTS_PAGE } from "@/src/features/landing/lib/catalog-links";
import type { ShowcaseTreatmentDetail } from "@/src/features/treatments/api/showcase.types";

export function RecommendedProducts({ products }: { products: ShowcaseTreatmentDetail["recommendedProducts"] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="en-casa" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="en-casa" className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-[#062112]">
            Sigue el cuidado en casa
          </h2>
          <Link
            href={PRODUCTS_PAGE}
            className="font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
          >
            Ver todos los productos
          </Link>
        </div>
        <ul className="border-t border-[#BF9250]/25">
          {products.map((product, index) => (
            <Reveal as="li" key={product.slug} delay={index * 80}>
              <Link
                href={`${PRODUCTS_PAGE}/${product.slug}`}
                className="group/rec grid gap-2 border-b border-[#BF9250]/25 py-6 desk:grid-cols-[1.2fr_1fr_auto] desk:items-baseline desk:gap-8"
              >
                <span className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[#062112]">{product.name}</span>
                <span className="font-sans text-[0.95rem] text-[#062112]/70">{product.tagline}</span>
                <span className="flex items-center gap-3 font-sans text-base font-bold tabular-nums text-[#062112]">
                  {product.priceFromPesos !== null && `Desde ${formatPesos(product.priceFromPesos)}`}
                  <span className="grid size-9 place-items-center rounded-full bg-[#E0BC87] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/rec:-translate-y-0.5 group-hover/rec:translate-x-0.5">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
