import type { CatalogFilters, CatalogSort } from "@/src/features/products-catalog/api/catalog.types";

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name", label: "Nombre A–Z" },
];

export const EMPTY_FILTERS: CatalogFilters = {
  category: null,
  tags: [],
  q: "",
  minPrice: null,
  maxPrice: null,
  sort: "featured",
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ParamSource = { get(name: string): string | null };

function readInt(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

export function readFilters(params: ParamSource): CatalogFilters {
  const category = params.get("categoria");
  const sort = params.get("orden");
  return {
    category: category && SLUG.test(category) ? category : null,
    tags: (params.get("necesidad") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => SLUG.test(tag)),
    q: (params.get("q") ?? "").slice(0, 80),
    minPrice: readInt(params.get("min")),
    maxPrice: readInt(params.get("max")),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as CatalogSort) : "featured",
  };
}

export function toSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.category) params.set("categoria", filters.category);
  if (filters.tags.length > 0) params.set("necesidad", filters.tags.join(","));
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.minPrice !== null) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("max", String(filters.maxPrice));
  if (filters.sort !== "featured") params.set("orden", filters.sort);
  return params;
}

export function toApiQuery(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.tags.length > 0) params.set("tags", filters.tags.join(","));
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function toggleTag(filters: CatalogFilters, tag: string): CatalogFilters {
  const tags = filters.tags.includes(tag)
    ? filters.tags.filter((item) => item !== tag)
    : [...filters.tags, tag];
  return { ...filters, tags };
}

export function activeFilterCount(filters: CatalogFilters): number {
  return (
    (filters.category ? 1 : 0) +
    filters.tags.length +
    (filters.q.trim() ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0)
  );
}
