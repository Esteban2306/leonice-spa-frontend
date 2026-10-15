"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, FileClock, X } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/src/components/ui/sheet";
import { fetchProductInBrowser } from "@/src/features/products-catalog/api/catalog.api";
import type {
  CatalogProductCard,
  CatalogProductDetail,
} from "@/src/features/products-catalog/api/catalog.types";
import { ProductMedia } from "@/src/features/products-catalog/components/product-media";
import { UsageSteps } from "@/src/features/products-catalog/components/usage-steps";
import { VariantPicker } from "@/src/features/products-catalog/components/variant-picker";
import { productHref } from "@/src/features/products-catalog/lib/catalog-format";

interface QuickViewSheetProps {
  product: CatalogProductCard | null;
  onClose: () => void;
}

function Item({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className="quick-view-item" style={{ "--i": index } as CSSProperties}>
      {children}
    </div>
  );
}

export function QuickViewSheet({ product, onClose }: QuickViewSheetProps) {
  const [loaded, setLoaded] = useState<{ slug: string; detail: CatalogProductDetail | null; failed: boolean } | null>(null);
  const current = product && loaded?.slug === product.slug ? loaded : null;
  const detail = current?.detail ?? null;
  const failed = current?.failed ?? false;

  useEffect(() => {
    if (!product) return;
    const controller = new AbortController();
    fetchProductInBrowser(product.slug, controller.signal)
      .then((data) => setLoaded({ slug: product.slug, detail: data, failed: false }))
      .catch(() => {
        if (!controller.signal.aborted) setLoaded({ slug: product.slug, detail: null, failed: true });
      });
    return () => controller.abort();
  }, [product]);

  return (
    <Sheet open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        data-quick-view
        showCloseButton={false}
        className="w-full gap-0 overflow-hidden border-l border-[#BF9250]/30 bg-[#FDF8F1] p-0 text-[#062112] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[side=right]:w-full data-[side=right]:sm:max-w-lg data-[side=right]:data-starting-style:translate-x-[30%] data-[side=right]:data-ending-style:translate-x-[30%]"
      >
        {product && (
          <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <Item index={0}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <SheetTitle className="font-heading text-[clamp(2rem,4vw,2.75rem)] leading-[1.02] text-[#062112]">
                      {product.name}
                    </SheetTitle>
                    {product.tagline && (
                      <SheetDescription className="font-sans text-base text-[#062112]/70">
                        {product.tagline}
                      </SheetDescription>
                    )}
                  </div>
                  <SheetClose
                    render={
                      <button
                        type="button"
                        aria-label="Cerrar vista rápida"
                        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border border-[#062112]/15 text-[#062112] transition-colors hover:bg-[#062112] hover:text-[#F2EBDB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]"
                      />
                    }
                  >
                    <X className="size-4" />
                  </SheetClose>
                </div>
              </Item>

              <Item index={1}>
                <ProductMedia imageUrl={product.imageUrl} name={product.name} sizes="(min-width: 640px) 32rem, 100vw" className="w-full max-w-[13rem]" />
              </Item>

              {detail?.contentNeedsReview && (
                <Item index={2}>
                  <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#BF9250]/60 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
                    <FileClock className="size-3.5" aria-hidden="true" />
                    Descripción en revisión
                  </p>
                </Item>
              )}

              {product.purpose && (
                <Item index={2}>
                  <section aria-label="Para qué sirve" className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl text-[#062112]">Para qué sirve</h3>
                    <p className="font-sans text-[0.95rem] leading-relaxed text-pretty text-[#062112]/75">{product.purpose}</p>
                  </section>
                </Item>
              )}

              <Item index={3}>
                <VariantPicker productName={product.name} variants={product.variants} size="md" />
              </Item>

              <Item index={4}>
                <section aria-label="Cómo usarlo" className="flex flex-col gap-3">
                  <h3 className="font-heading text-2xl text-[#062112]">Cómo usarlo</h3>
                  {detail ? (
                    <UsageSteps steps={detail.howToUse} compact />
                  ) : failed ? (
                    <p className="font-sans text-sm text-[#062112]/65">
                      No pudimos cargar el modo de uso. Ábrelo en la página del producto.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Cargando modo de uso">
                      {Array.from({ length: Math.max(product.howToUseCount, 3) }, (_, index) => (
                        <div key={index} className="h-8 animate-pulse rounded-full bg-[#062112]/6 motion-reduce:animate-none" />
                      ))}
                    </div>
                  )}
                </section>
              </Item>

              {detail && detail.treatments.length > 0 && (
                <Item index={5}>
                  <section aria-label="Lo usamos en" className="flex flex-col gap-2">
                    <h3 className="font-heading text-2xl text-[#062112]">Lo usamos en cabina</h3>
                    <ul className="flex flex-wrap gap-2">
                      {detail.treatments.map((treatment) => (
                        <li key={`${treatment.categorySlug}/${treatment.slug}`}>
                          <Link
                            href={`/tratamientos/${treatment.categorySlug}/${treatment.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#F2EBDB] px-3 py-1.5 font-sans text-sm text-[#062112] transition-colors hover:bg-[#E0BC87]"
                          >
                            {treatment.name}
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Item>
              )}
            </div>

            <div className="sticky bottom-0 mt-auto border-t border-[#BF9250]/25 bg-[#FDF8F1]/95 p-4 backdrop-blur-md sm:px-8">
              <Link
                href={productHref(product.slug)}
                onClick={onClose}
                className="group/full flex items-center justify-between rounded-full bg-[#062112] py-2 pl-6 pr-2 font-sans text-sm font-bold text-[#F2EBDB] transition-colors hover:bg-[#0d3320]"
              >
                Ver todo sobre {product.name}
                <span className="grid size-9 place-items-center rounded-full bg-[#E0BC87] text-[#062112] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/full:-translate-y-0.5 group-hover/full:translate-x-0.5">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
