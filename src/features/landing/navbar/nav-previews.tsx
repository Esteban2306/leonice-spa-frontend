"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  Clock,
  Droplets,
  FlaskConical,
  Flower2,
  Layers,
  Package,
  Sparkles,
  Sprout,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type {
  LandingCategory,
  LandingProduct,
} from "@/src/features/landing/content/landing-content";
import { formatDuration, formatPesos, formatThousandsCop } from "@/src/features/landing/lib/format";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import { scrollToSection } from "@/src/features/landing/motion/scroll-to-section";

const EASE = [0.16, 1, 0.3, 1] as const;

interface ProductGroup {
  key: string;
  name: string;
  products: LandingProduct[];
}

const CATEGORY_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /shampoo|champu|limpie/, icon: Droplets },
  { match: /acondicion|hidrata/, icon: Waves },
  { match: /mascarilla/, icon: Layers },
  { match: /aceite|serum|suero/, icon: FlaskConical },
  { match: /fragancia|perfume|aroma/, icon: Flower2 },
  { match: /estiliz|peinar|fijad|calor/, icon: Wind },
  { match: /tratamiento|tonico|caida|cuero/, icon: Sprout },
  { match: /brillo|color|repar/, icon: Sparkles },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function categoryIcon(name: string): LucideIcon {
  const key = normalize(name);
  return CATEGORY_ICONS.find((entry) => entry.match.test(key))?.icon ?? Package;
}

function groupByCategory(products: LandingProduct[]): ProductGroup[] {
  const groups = new Map<string, ProductGroup>();
  for (const product of products) {
    const name = product.categoryName?.trim() || "Otros productos";
    const key = normalize(name);
    const group = groups.get(key) ?? { key, name, products: [] };
    group.products.push(product);
    groups.set(key, group);
  }
  return [...groups.values()];
}

function priceFrom(product: LandingProduct): number | null {
  const prices = product.variants
    .map((variant) => variant.pricePesos)
    .filter((price): price is number => price !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE },
    transitionEnd: { filter: "none" },
  },
};

export function TreatmentsPreview({
  categories,
  onNavigate,
}: {
  categories: LandingCategory[];
  onNavigate: () => void;
}) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  if (!active) {
    return (
      <p className="font-sans text-sm text-[#062112]/70">
        Muy pronto verás aquí nuestras categorías de tratamientos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(12rem,15rem)_1fr] gap-6">
      <motion.ul variants={list} initial="hidden" animate="show" className="flex flex-col gap-1">
        {categories.map((category) => {
          const selected = category.id === active.id;
          return (
            <motion.li key={category.id} variants={item}>
              <button
                type="button"
                onMouseEnter={() => setActiveId(category.id)}
                onFocus={() => setActiveId(category.id)}
                onClick={() => {
                  onNavigate();
                  scrollToSection(SECTION_IDS.treatments);
                }}
                className={`relative flex w-full cursor-pointer flex-col items-start rounded-2xl px-4 py-3 text-left transition-colors duration-300 ${
                  selected ? "text-[#F2EBDB]" : "text-[#062112] hover:bg-[#062112]/5"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="nav-category-pill"
                    className="absolute inset-0 rounded-2xl bg-[#062112]"
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                )}
                <span className="relative font-heading text-2xl leading-tight">{category.name}</span>
                <span
                  className={`relative font-sans text-xs ${selected ? "text-[#E0BC87]" : "text-[#062112]/60"}`}
                >
                  {category.treatmentCount} {category.treatmentCount === 1 ? "servicio" : "servicios"}
                  {category.fromThousands !== null && ` · desde ${formatThousandsCop(category.fromThousands)}`}
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      <AnimatePresence mode="wait">
        <motion.ul
          key={active.id}
          variants={list}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid content-start gap-2"
        >
          {active.highlights.map((treatment) => (
            <motion.li
              key={treatment.id}
              variants={item}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#BF9250]/25 bg-[#FDF8F1] px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-sans font-bold text-[#062112]">{treatment.name}</p>
                <p className="flex items-center gap-1.5 font-sans text-xs text-[#062112]/65">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {formatDuration(treatment.durationMinutes)}
                </p>
              </div>
              <p className="shrink-0 font-sans text-sm font-bold text-[#7a5a2c] tabular-nums">
                desde {formatThousandsCop(treatment.promotion?.priceFromThousands ?? treatment.priceFromThousands)}
              </p>
            </motion.li>
          ))}
          <motion.li variants={item}>
            <button
              type="button"
              onClick={() => {
                onNavigate();
                scrollToSection(SECTION_IDS.treatments);
              }}
              className="group mt-1 inline-flex cursor-pointer items-center gap-2 font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
            >
              Ver todos los tratamientos
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </motion.li>
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}

const productCountLabel = (count: number) => `${count} ${count === 1 ? "producto" : "productos"}`;

export function ProductsPreview({
  products,
  onNavigate,
}: {
  products: LandingProduct[];
  onNavigate: () => void;
}) {
  const groups = useMemo(() => groupByCategory(products), [products]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = groups.find((group) => group.key === activeKey) ?? null;

  if (groups.length === 0) {
    return (
      <p className="font-sans text-sm text-[#062112]/70">
        Muy pronto verás aquí nuestros productos.
      </p>
    );
  }

  const goToProducts = () => {
    onNavigate();
    scrollToSection(SECTION_IDS.products);
  };

  if (!active) {
    return (
      <div className="flex flex-col gap-5">
        <motion.ul
          variants={list}
          initial="hidden"
          animate="show"
          className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3"
        >
          {groups.map((group) => {
            const Icon = categoryIcon(group.name);
            return (
              <motion.li key={group.key} variants={item}>
                <button
                  type="button"
                  onClick={() => setActiveKey(group.key)}
                  className="group flex w-full cursor-pointer flex-col items-center gap-3 rounded-3xl border border-[#BF9250]/25 bg-[#FDF8F1] px-4 py-6 text-center transition-colors duration-300 hover:bg-[#062112] hover:text-[#F2EBDB] focus-visible:bg-[#062112] focus-visible:text-[#F2EBDB]"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-[#E0BC87]/45 text-[#062112] transition-colors duration-300 group-hover:bg-[#E0BC87] group-focus-visible:bg-[#E0BC87]">
                    <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-heading text-xl leading-tight">{group.name}</span>
                  <span className="font-sans text-xs text-[#062112]/60 transition-colors duration-300 group-hover:text-[#E0BC87] group-focus-visible:text-[#E0BC87]">
                    {productCountLabel(group.products.length)}
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
        <button
          type="button"
          onClick={goToProducts}
          className="group inline-flex cursor-pointer items-center gap-2 self-start font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]"
        >
          Explorar todos los productos
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[minmax(12rem,15rem)_1fr] gap-6">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setActiveKey(null)}
          className="group inline-flex w-fit cursor-pointer items-center gap-1 rounded-full py-1 pr-3 font-sans text-xs font-bold text-[#062112]/70 transition-colors hover:text-[#062112]"
        >
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          Todas las categorías
        </button>
        <motion.ul variants={list} initial="hidden" animate="show" className="flex flex-col gap-1">
          {groups.map((group) => {
            const selected = group.key === active.key;
            const Icon = categoryIcon(group.name);
            return (
              <motion.li key={group.key} variants={item}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveKey(group.key)}
                  onFocus={() => setActiveKey(group.key)}
                  onClick={() => setActiveKey(group.key)}
                  aria-pressed={selected}
                  className={`relative flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors duration-300 ${
                    selected ? "text-[#F2EBDB]" : "text-[#062112] hover:bg-[#062112]/5"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="nav-product-category-pill"
                      className="absolute inset-0 rounded-2xl bg-[#062112]"
                      transition={{ duration: 0.45, ease: EASE }}
                    />
                  )}
                  <Icon
                    className={`relative size-5 shrink-0 ${selected ? "text-[#E0BC87]" : "text-[#7a5a2c]"}`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span className="relative flex min-w-0 flex-col">
                    <span className="truncate font-heading text-xl leading-tight">{group.name}</span>
                    <span
                      className={`font-sans text-xs ${selected ? "text-[#E0BC87]" : "text-[#062112]/60"}`}
                    >
                      {productCountLabel(group.products.length)}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={active.key}
          variants={list}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid max-h-[22rem] content-start gap-2 overflow-y-auto pr-1"
        >
          {active.products.map((product) => {
            const from = priceFrom(product);
            const presentations = product.variants.map((variant) => variant.presentation).join(" · ");
            return (
              <motion.li key={product.id} variants={item}>
                <button
                  type="button"
                  onClick={goToProducts}
                  className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border border-[#BF9250]/25 bg-[#FDF8F1] px-4 py-3 text-left transition-colors duration-300 hover:border-[#BF9250]/60 hover:bg-white"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-sans font-bold text-[#062112]">{product.name}</span>
                    {presentations && (
                      <span className="block truncate font-sans text-xs text-[#062112]/65">{presentations}</span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    {from !== null && (
                      <span className="font-sans text-sm font-bold text-[#7a5a2c] tabular-nums">
                        desde {formatPesos(from)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 font-sans text-sm font-bold text-[#062112] underline decoration-[#BF9250] decoration-2 underline-offset-[6px]">
                      Ver producto
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
