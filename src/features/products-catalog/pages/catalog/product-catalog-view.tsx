"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { RotateCcw, SearchX } from "lucide-react";

import { BookingBand } from "@/src/features/landing/components/booking-band";
import { fetchCatalogInBrowser } from "@/src/features/products-catalog/api/catalog.api";
import type {
  CatalogFilters,
  CatalogProductCard,
  CatalogResult,
} from "@/src/features/products-catalog/api/catalog.types";
import { CatalogFilterBar } from "@/src/features/products-catalog/components/catalog-filter-bar";
import { ProductCard } from "@/src/features/products-catalog/components/product-card";
import { QuickViewSheet } from "@/src/features/products-catalog/components/quick-view-sheet";
import { EMPTY_FILTERS, toSearchParams } from "@/src/features/products-catalog/lib/catalog-filters";
import { Breadcrumbs } from "@/src/features/landing/components/breadcrumbs";

const EASE = [0.16, 1, 0.3, 1] as const;
const LAYOUT_LIMIT = 40;

interface ProductCatalogViewProps {
  initialFilters: CatalogFilters;
  initialResult: CatalogResult;
}

export function ProductCatalogView({ initialFilters, initialResult }: ProductCatalogViewProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [quickView, setQuickView] = useState<CatalogProductCard | null>(null);
  const controller = useRef<AbortController | null>(null);

  const load = useCallback((next: CatalogFilters) => {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setLoading(true);
    setFailed(false);
    fetchCatalogInBrowser(next, current.signal)
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        if (current.signal.aborted) return;
        setFailed(true);
        setLoading(false);
      });
  }, []);

  const change = useCallback(
    (next: CatalogFilters) => {
      setFilters(next);
      const query = toSearchParams(next).toString();
      window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
      load(next);
    },
    [load],
  );

  useEffect(() => () => controller.current?.abort(), []);

  const animateLayout = result.items.length <= LAYOUT_LIMIT;

  return (
    <MotionConfig reducedMotion="user">
      <header className="px-5 pb-10 sm:px-8 sm:pb-14">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Productos" }]} />
          <div className="grid gap-8 desk:grid-cols-[1.2fr_0.8fr] desk:items-end">
            <h1 className="sunlit-text font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.015em] text-balance text-[#062112]">
              Tu rutina en casa
            </h1>
            <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/70">
              Lo que usamos en cabina, para que el cuidado siga en tu baño. Elige qué necesita tu cabello y la
              carta se ordena para ti.
            </p>
          </div>
        </div>
      </header>

      <CatalogFilterBar
        filters={filters}
        facets={result.facets}
        total={result.total}
        loading={loading}
        onChange={change}
        onReset={() => change(EMPTY_FILTERS)}
      />

      <section aria-label="Carta de productos" className="px-5 pb-24 pt-6 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-[1440px]">
          {failed && (
            <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-dashed border-[#BF9250]/60 p-5 font-sans text-sm text-[#062112]/80">
              No pudimos actualizar la carta. Revisa tu conexión e intenta de nuevo.
              <button
                type="button"
                onClick={() => load(filters)}
                className="inline-flex cursor-pointer items-center gap-1.5 font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          )}

          <LayoutGroup>
            <ul
              aria-busy={loading}
              className={`grid grid-cols-1 gap-5 transition-opacity duration-300 min-[480px]:grid-cols-2 desk:grid-cols-3 xl:grid-cols-4 ${
                loading ? "opacity-55" : "opacity-100"
              }`}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {result.items.map((product, index) => (
                  <motion.li
                    key={product.id}
                    layout={animateLayout ? "position" : false}
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25, ease: EASE } }}
                    transition={{ duration: 0.7, ease: EASE, delay: Math.min(index, 8) * 0.045 }}
                    className="h-full"
                  >
                    <ProductCard product={product} priority={index < 4} onQuickView={setQuickView} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </LayoutGroup>

          <AnimatePresence>
            {result.items.length === 0 && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-5 py-20 text-center"
              >
                <SearchX className="size-8 text-[#BF9250]" strokeWidth={1.4} aria-hidden="true" />
                <p className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-[#062112]">
                  Ningún producto coincide con esa combinación
                </p>
                <p className="max-w-[44ch] font-sans text-base text-[#062112]/65">
                  Quita alguna necesidad o amplía el rango de precio para ver más opciones.
                </p>
                <button
                  type="button"
                  onClick={() => change(EMPTY_FILTERS)}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-[#062112] px-6 font-sans text-sm font-bold text-[#F2EBDB] transition-colors hover:bg-[#0d3320]"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Ver toda la carta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <BookingBand
        title="¿No sabes cuál es para ti?"
        lead="En tu diagnóstico capilar te recomendamos la rutina exacta para tu cabello, con los productos que usamos en cabina."
        message="Hola, quiero agendar un diagnóstico capilar y que me recomienden productos."
        actionLabel="Agenda tu diagnóstico"
      />

      <QuickViewSheet product={quickView} onClose={() => setQuickView(null)} />
    </MotionConfig>
  );
}
