import { getCatalog } from "@/src/features/products-catalog/api/catalog.api";
import { ProductCatalogView } from "@/src/features/products-catalog/pages/catalog/product-catalog-view";
import { readFilters } from "@/src/features/products-catalog/lib/catalog-filters";

type SearchParams = Record<string, string | string[] | undefined>;

function toParams(searchParams: SearchParams) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }
  return params;
}

export async function ProductCatalogContainer({ searchParams }: { searchParams: SearchParams }) {
  const filters = readFilters(toParams(searchParams));
  const result = await getCatalog(filters);
  return <ProductCatalogView initialFilters={filters} initialResult={result} />;
}
