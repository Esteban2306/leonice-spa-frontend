import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";

import { Reveal } from "@/src/features/landing/components/reveal";
import { formatPesos } from "@/src/features/landing/lib/format";
import type {
  CatalogRitualItem,
  CatalogRitualReference,
  CatalogRitualSummary,
} from "@/src/features/products-catalog/api/catalog.types";
import { productHref } from "@/src/features/products-catalog/lib/catalog-format";
import { hasSavings } from "@/src/features/products-catalog/lib/ritual-format";

export function RitualIncludes({
  items,
  pricePesos,
  ritual,
}: {
  items: CatalogRitualItem[];
  pricePesos: number | null;
  ritual: CatalogRitualSummary;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="que-incluye" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto grid max-w-[1440px] gap-10 desk:grid-cols-[0.8fr_1.2fr] desk:gap-16">
        <Reveal className="flex flex-col gap-5">
          <h2
            id="que-incluye"
            className="sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#062112]"
          >
            Qué incluye
          </h2>
          <p className="max-w-[44ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/72">
            Cada producto también se vende por separado. En el Ritual los llevas juntos, en el orden en que se usan.
          </p>
        </Reveal>
        <div className="flex flex-col">
          <ul className="flex flex-col">
            {items.map((item, index) => (
              <Reveal
                as="li"
                key={`${item.productSlug}-${item.presentation}`}
                delay={index * 80}
                className="border-b border-[#BF9250]/30 first:border-t"
              >
                <Link
                  href={productHref(item.productSlug)}
                  className="group/item grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]"
                >
                  <span className="relative size-14 overflow-hidden rounded-2xl bg-[#EDE3D0]">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-contain p-1.5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-[clamp(1.25rem,2vw,1.625rem)] leading-tight text-[#062112] underline-offset-4 group-hover/item:underline">
                      {item.quantity > 1 && <span className="tabular-nums">{item.quantity} × </span>}
                      {item.productName}
                    </span>
                    <span className="block font-sans text-sm text-[#062112]/70">
                      {item.brand} · {item.presentation}
                    </span>
                  </span>
                  <span className="flex items-center gap-2 font-sans text-sm tabular-nums text-[#062112]/80">
                    {formatPesos(item.unitPricePesos)}
                    <ArrowUpRight className="size-4 text-[#062112]" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#F2EBDB] p-4">
              <dt className="font-sans text-xs text-[#062112]/70">Por separado</dt>
              <dd className="font-sans text-lg tabular-nums text-[#062112]">{formatPesos(ritual.separatePricePesos)}</dd>
            </div>
            {pricePesos !== null && (
              <div className="rounded-2xl bg-[#062112] p-4">
                <dt className="font-sans text-xs text-[#F2EBDB]/75">Con el Ritual</dt>
                <dd className="font-sans text-lg font-bold tabular-nums text-[#E0BC87]">{formatPesos(pricePesos)}</dd>
              </div>
            )}
            {hasSavings(ritual) && (
              <div className="col-span-2 rounded-2xl border border-dashed border-[#BF9250]/60 p-4 sm:col-span-1">
                <dt className="font-sans text-xs text-[#062112]/70">Ahorras</dt>
                <dd className="font-sans text-lg font-bold tabular-nums text-[#062112]">
                  {formatPesos(ritual.savingsPesos)} ({ritual.savingsPercent} %)
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function AlsoInRitual({ rituals }: { rituals: CatalogRitualReference[] }) {
  if (rituals.length === 0) return null;
  return (
    <section aria-labelledby="tambien-en-ritual" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
        <h2 id="tambien-en-ritual" className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-[#062112]">
          También viene en un Ritual
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 desk:grid-cols-3">
          {rituals.map((ritual) => (
            <li key={ritual.slug}>
              <Link
                href={productHref(ritual.slug)}
                className="group/r lit-dark lit-hover flex h-full flex-col gap-3 rounded-[1.75rem] bg-[#062112] p-6 [--lift:8px]"
              >
                <span className="inline-flex w-fit items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#E0BC87]">
                  <Layers className="size-3.5" aria-hidden="true" />
                  Ritual
                </span>
                <span className="font-heading text-2xl leading-tight text-[#F2EBDB]">{ritual.name}</span>
                <span className="mt-auto flex items-end justify-between gap-3">
                  <span className="flex flex-col font-sans tabular-nums">
                    {ritual.pricePesos !== null && (
                      <span className="text-base font-bold text-[#F2EBDB]">{formatPesos(ritual.pricePesos)}</span>
                    )}
                    {ritual.savingsPercent > 0 && (
                      <span className="text-sm text-[#E0BC87]">Ahorras {ritual.savingsPercent} %</span>
                    )}
                  </span>
                  <ArrowUpRight
                    className="size-5 text-[#F2EBDB] transition-transform duration-500 group-hover/r:-translate-y-0.5 group-hover/r:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
