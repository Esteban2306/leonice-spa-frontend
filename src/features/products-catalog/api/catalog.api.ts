import type {
  CatalogFilters,
  CatalogProductDetail,
  CatalogResult,
} from "@/src/features/products-catalog/api/catalog.types";
import { toApiQuery } from "@/src/features/products-catalog/lib/catalog-filters";
import { allowedImageUrl } from "@/src/features/landing/lib/allowed-image";
import type { CatalogProductCard } from "@/src/features/products-catalog/api/catalog.types";

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 6000;

export class CatalogUnavailableError extends Error {}

function apiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new CatalogUnavailableError("NEXT_PUBLIC_API_URL no está configurada");
  return url;
}

function safeCard<T extends CatalogProductCard>(product: T): T {
  return {
    ...product,
    imageUrl: allowedImageUrl(product.imageUrl),
    variants: product.variants.map((variant) => ({ ...variant, imageUrl: allowedImageUrl(variant.imageUrl) })),
  };
}

function safeResult(result: CatalogResult): CatalogResult {
  return { ...result, items: result.items.map(safeCard) };
}

function safeDetail(detail: CatalogProductDetail): CatalogProductDetail {
  return { ...safeCard(detail), related: detail.related.map(safeCard) };
}

function unwrap<T>(payload: T | { data: T }): T {
  return payload !== null && typeof payload === "object" && "data" in payload
    ? (payload as { data: T }).data
    : (payload as T);
}

export async function getCatalog(filters: CatalogFilters): Promise<CatalogResult> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl()}/catalog/products${toApiQuery(filters)}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["catalog"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new CatalogUnavailableError("No pudimos conectar con el catálogo", { cause: error });
  }
  if (!response.ok) throw new CatalogUnavailableError(`El catálogo respondió ${response.status}`);
  return safeResult(unwrap(await response.json()));
}

export async function getCatalogProduct(slug: string): Promise<CatalogProductDetail | null> {
  let response: Response;
  try {
    response = await fetch(`${apiUrl()}/catalog/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["catalog"] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    throw new CatalogUnavailableError("No pudimos conectar con el catálogo", { cause: error });
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new CatalogUnavailableError(`El catálogo respondió ${response.status}`);
  return safeDetail(unwrap(await response.json()));
}

export async function fetchCatalogInBrowser(
  filters: CatalogFilters,
  signal: AbortSignal,
): Promise<CatalogResult> {
  const response = await fetch(`${apiUrl()}/catalog/products${toApiQuery(filters)}`, { signal });
  if (!response.ok) throw new CatalogUnavailableError(`El catálogo respondió ${response.status}`);
  return safeResult(unwrap(await response.json()));
}

export async function fetchProductInBrowser(
  slug: string,
  signal: AbortSignal,
): Promise<CatalogProductDetail> {
  const response = await fetch(`${apiUrl()}/catalog/products/${encodeURIComponent(slug)}`, { signal });
  if (!response.ok) throw new CatalogUnavailableError(`El catálogo respondió ${response.status}`);
  return safeDetail(unwrap(await response.json()));
}
