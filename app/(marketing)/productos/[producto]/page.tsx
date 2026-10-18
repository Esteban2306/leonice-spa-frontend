import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { pageMetadata } from "@/src/features/landing/lib/seo";
import { breadcrumbJsonLd, productJsonLd } from "@/src/features/landing/lib/structured-data";
import { MarketingShell } from "@/src/features/landing/components/marketing-shell";
import { getCatalogProduct } from "@/src/features/products-catalog/api/catalog.api";
import { ProductDetailContainer } from "@/src/features/products-catalog/pages/product/product-detail-container";

import "@/src/features/products-catalog/products-catalog.css";

export const revalidate = 300;

type Params = Promise<{ producto: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { producto } = await params;
  const product = await getCatalogProduct(producto).catch(() => null);
  if (!product) return { title: "Productos" };
  return pageMetadata({
    title: product.name,
    description: product.purpose ?? product.tagline,
    path: `/productos/${product.slug}`,
    image: product.imageUrl,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { producto } = await params;
  const product = await getCatalogProduct(producto).catch(() => null);
  return (
    <MarketingShell>
      {product && (
        <>
          <JsonLd
            data={productJsonLd({
              name: product.name,
              description: product.purpose ?? product.tagline,
              path: `/productos/${product.slug}`,
              image: product.imageUrl,
              brand: product.brands[0] ?? null,
              categoryName: product.category.name,
              priceMinPesos: product.priceMinPesos,
              priceMaxPesos: product.priceMaxPesos,
            })}
          />
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Productos", path: "/productos" },
              { name: product.name, path: `/productos/${product.slug}` },
            ])}
          />
        </>
      )}
      <ProductDetailContainer slug={producto} />
    </MarketingShell>
  );
}
