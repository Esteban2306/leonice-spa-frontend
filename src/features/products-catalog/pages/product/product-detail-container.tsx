import { notFound } from "next/navigation";

import { getCatalogProduct } from "@/src/features/products-catalog/api/catalog.api";
import { ProductDetailView } from "@/src/features/products-catalog/pages/product/product-detail-view";

export async function ProductDetailContainer({ slug }: { slug: string }) {
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
