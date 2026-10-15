"use client";

import { useState } from "react";

import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";
import { ProductCard } from "@/src/features/products-catalog/components/product-card";
import { QuickViewSheet } from "@/src/features/products-catalog/components/quick-view-sheet";
import { Reveal } from "@/src/features/landing/components/reveal";

export function ProductGrid({ products }: { products: CatalogProductCard[] }) {
  const [quickView, setQuickView] = useState<CatalogProductCard | null>(null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 desk:grid-cols-4">
        {products.map((product, index) => (
          <Reveal as="li" key={product.id} delay={index * 80} className="h-full">
            <ProductCard product={product} onQuickView={setQuickView} />
          </Reveal>
        ))}
      </ul>
      <QuickViewSheet product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
