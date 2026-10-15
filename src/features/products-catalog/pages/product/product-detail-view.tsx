import Link from "next/link";
import { ArrowUpRight, CalendarClock, Info, Sparkle } from "lucide-react";

import { BookingBand } from "@/src/features/landing/components/booking-band";
import { Breadcrumbs } from "@/src/features/landing/components/breadcrumbs";
import { Reveal } from "@/src/features/landing/components/reveal";
import { ReviewPendingChip } from "@/src/features/landing/components/review-pending-chip";
import { StickyBookingBar } from "@/src/features/landing/components/sticky-booking-bar";
import { formatPesos } from "@/src/features/landing/lib/format";
import type { CatalogProductDetail } from "@/src/features/products-catalog/api/catalog.types";
import { ProductMedia } from "@/src/features/products-catalog/components/product-media";
import { UsageSteps } from "@/src/features/products-catalog/components/usage-steps";
import { VariantPicker } from "@/src/features/products-catalog/components/variant-picker";
import {
  PRODUCTS_ROOT,
  priceRangeLabel,
  productHref,
  productOrderMessage,
} from "@/src/features/products-catalog/lib/catalog-format";

export function ProductDetailView({ product }: { product: CatalogProductDetail }) {
  const categoryHref = `${PRODUCTS_ROOT}?categoria=${product.category.slug}`;

  return (
    <>
      <header id="producto-portada" className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Productos", href: PRODUCTS_ROOT },
              { label: product.category.name, href: categoryHref },
              { label: product.name },
            ]}
          />
          <div className="grid gap-12 desk:grid-cols-[0.9fr_1.1fr] desk:items-center desk:gap-20">
            <ProductMedia
              imageUrl={product.imageUrl}
              name={product.name}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="mx-auto w-full max-w-[30rem] desk:max-w-none"
            />
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-5">
                <h1 className="sunlit-text font-heading text-[clamp(3rem,6.4vw,5.5rem)] leading-[0.96] tracking-[-0.015em] text-balance text-[#062112]">
                  {product.name}
                </h1>
                {product.tagline && (
                  <p className="max-w-[32ch] font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.2] text-pretty text-[#062112]/85">
                    {product.tagline}
                  </p>
                )}
              </div>
              {product.contentNeedsReview && <ReviewPendingChip />}
              {product.tags.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Ideal para estas necesidades">
                  {product.tags.map((tag) => (
                    <li key={tag.slug}>
                      <Link
                        href={`${PRODUCTS_ROOT}?necesidad=${tag.slug}`}
                        className="inline-flex h-9 items-center rounded-full border border-[#062112]/15 px-4 font-sans text-sm text-[#062112] transition-colors hover:border-[#062112] hover:bg-[#062112] hover:text-[#F2EBDB]"
                      >
                        {tag.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <VariantPicker productName={product.name} variants={product.variants} />
            </div>
          </div>
        </div>
      </header>

      {(product.purpose || product.benefits.length > 0) && (
        <section aria-labelledby="para-que-sirve" className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto grid max-w-[1440px] gap-10 desk:grid-cols-[0.8fr_1.2fr] desk:gap-16">
            <Reveal className="flex flex-col gap-5">
              <h2
                id="para-que-sirve"
                className="sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#062112]"
              >
                Para qué sirve
              </h2>
              {product.purpose && (
                <p className="max-w-[52ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/72">
                  {product.purpose}
                </p>
              )}
            </Reveal>
            <ul className="flex flex-col">
              {product.benefits.map((benefit, index) => (
                <Reveal
                  as="li"
                  key={benefit}
                  delay={index * 80}
                  className="flex items-baseline gap-5 border-b border-[#BF9250]/30 py-5 first:border-t"
                >
                  <Sparkle className="size-5 shrink-0 translate-y-1 text-[#BF9250]" strokeWidth={1.4} aria-hidden="true" />
                  <span className="font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.2] text-[#062112]">
                    {benefit}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {product.howToUse.length > 0 && (
        <section aria-labelledby="como-usarlo" className="bg-[#F2EBDB] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-12 desk:grid-cols-[0.85fr_1.15fr] desk:gap-20">
            <div className="flex flex-col gap-6 desk:sticky desk:top-32 desk:self-start">
              <h2
                id="como-usarlo"
                className="sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#062112]"
              >
                Cómo usarlo
              </h2>
              {product.usageFrequency && (
                <p className="flex max-w-[44ch] items-start gap-3 font-sans text-lg leading-relaxed text-pretty text-[#062112]/72">
                  <CalendarClock className="mt-1 size-5 shrink-0 text-[#BF9250]" aria-hidden="true" />
                  {product.usageFrequency}
                </p>
              )}
            </div>
            <Reveal className="lit rounded-[2rem] bg-[#FDF8F1] p-6 [--lift:14px] sm:p-10">
              <UsageSteps steps={product.howToUse} />
            </Reveal>
          </div>
        </section>
      )}

      {(product.idealFor.length > 0 || product.precautions.length > 0) && (
        <section aria-label="Para quién es y precauciones" className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-[1440px] gap-6 desk:grid-cols-[1.2fr_0.8fr]">
            {product.idealFor.length > 0 && (
              <Reveal className="lit-dark flex flex-col gap-6 rounded-[2rem] bg-[#062112] p-7 [--lift:16px] sm:p-10">
                <h2 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[#F2EBDB]">Es para ti si…</h2>
                <ul className="flex flex-col gap-3">
                  {product.idealFor.map((item) => (
                    <li key={item} className="flex items-baseline gap-4 font-heading text-[clamp(1.375rem,2vw,1.75rem)] leading-tight text-[#F2EBDB]">
                      <span aria-hidden="true" className="size-2 shrink-0 translate-y-[-0.2em] rounded-full bg-[#E0BC87]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {product.precautions.length > 0 && (
              <Reveal delay={90} className="flex flex-col gap-5 rounded-[2rem] border border-dashed border-[#BF9250]/60 p-7 sm:p-10">
                <div className="flex items-center gap-3">
                  <Info className="size-5 text-[#BF9250]" aria-hidden="true" />
                  <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">Ten en cuenta</h2>
                </div>
                <ul className="flex flex-col gap-4">
                  {product.precautions.map((item) => (
                    <li key={item} className="font-sans text-base leading-relaxed text-pretty text-[#062112]/80">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {product.treatments.length > 0 && (
        <section aria-labelledby="en-cabina" className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
            <h2 id="en-cabina" className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-[#062112]">
              Lo usamos en cabina
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 desk:grid-cols-3">
              {product.treatments.map((treatment) => (
                <li key={`${treatment.categorySlug}/${treatment.slug}`}>
                  <Link
                    href={`/tratamientos/${treatment.categorySlug}/${treatment.slug}`}
                    className="group/t lit lit-hover flex h-full flex-col gap-2 rounded-[1.75rem] bg-[#F2EBDB] p-6 [--lift:8px]"
                  >
                    <span className="font-sans text-xs font-bold text-[#7a5a2c]">{treatment.categoryName}</span>
                    <span className="font-heading text-2xl leading-tight text-[#062112]">{treatment.name}</span>
                    {treatment.tagline && <span className="font-sans text-sm text-[#062112]/70">{treatment.tagline}</span>}
                    <ArrowUpRight className="mt-auto size-5 self-end text-[#062112] transition-transform duration-500 group-hover/t:-translate-y-0.5 group-hover/t:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {product.related.length > 0 && (
        <section aria-labelledby="relacionados" className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-8">
            <h2 id="relacionados" className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-[#062112]">
              Combínalo con
            </h2>
            <ul className="border-t border-[#BF9250]/25">
              {product.related.map((related) => (
                <li key={related.id}>
                  <Link
                    href={productHref(related.slug)}
                    className="catalog-row group/rel grid gap-2 border-b border-[#BF9250]/25 py-6 desk:grid-cols-[1.2fr_1fr_auto] desk:items-baseline desk:gap-8"
                  >
                    <span className="catalog-row-name w-fit pb-1 font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[#062112]">
                      {related.name}
                    </span>
                    <span className="font-sans text-[0.95rem] text-[#062112]/70">{related.tagline ?? related.purpose}</span>
                    <span className="flex items-center gap-3 font-sans text-base font-bold tabular-nums text-[#062112]">
                      {priceRangeLabel(related.priceMinPesos, related.priceMaxPesos)}
                      <span className="grid size-9 place-items-center rounded-full bg-[#E0BC87] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/rel:-translate-y-0.5 group-hover/rel:translate-x-0.5">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <BookingBand
        title="¿Quieres que te armemos la rutina?"
        lead="En tu diagnóstico capilar revisamos tu cabello y te decimos qué productos usar y en qué orden."
        message="Hola, quiero agendar un diagnóstico capilar y que me recomienden productos."
        actionLabel="Agenda tu diagnóstico"
        secondary={{ label: "Pedir este producto", message: productOrderMessage(product.name) }}
      />

      <StickyBookingBar
        watchId="producto-portada"
        title={product.name}
        detail={product.priceMinPesos !== null ? `Desde ${formatPesos(product.priceMinPesos)}` : null}
        message={productOrderMessage(product.name)}
        actionLabel="Pedir"
      />
    </>
  );
}
