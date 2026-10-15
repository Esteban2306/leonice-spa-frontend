import type { Metadata } from "next";

import { MarketingShell } from "@/src/features/landing/components/marketing-shell";
import { getCatalogProduct } from "@/src/features/products-catalog/api/catalog.api";
import { ProductDetailContainer } from "@/src/features/products-catalog/pages/product/product-detail-container";

import "@/src/features/products-catalog/products-catalog.css";

export const revalidate = 300;

type Params = Promise<{ producto: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { producto } = await params;
  const product = await getCatalogProduct(producto).catch(() => null);
  if (!product) return { title: "Productos · Leonice Arenas Spa Capilar" };
  return {
    title: `${product.name} · Leonice Arenas Spa Capilar`,
    description: product.purpose ?? product.tagline ?? undefined,
    openGraph: product.imageUrl ? { images: [{ url: product.imageUrl }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { producto } = await params;
  return (
    <MarketingShell>
      <ProductDetailContainer slug={producto} />
    </MarketingShell>
  );
}
