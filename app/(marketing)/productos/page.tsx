import type { Metadata } from "next";

import { pageMetadata } from "@/src/features/landing/lib/seo";
import { MarketingShell } from "@/src/features/landing/components/marketing-shell";
import { ProductCatalogContainer } from "@/src/features/products-catalog/pages/catalog/product-catalog-container";

import "@/src/features/products-catalog/products-catalog.css";

export const metadata: Metadata = pageMetadata({
  title: "Productos para el cuidado capilar",
  description:
    "Los productos que usamos en cabina para continuar tu cuidado en casa: para qué sirve cada uno y cómo usarlo.",
  path: "/productos",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <MarketingShell>
      <ProductCatalogContainer searchParams={await searchParams} />
    </MarketingShell>
  );
}
