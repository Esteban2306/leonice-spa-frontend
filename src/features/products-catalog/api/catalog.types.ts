export type CatalogSort = "featured" | "price-asc" | "price-desc" | "name";

export interface CatalogVariant {
  id: string;
  brand: string;
  presentation: string;
  pricePesos: number;
  imageUrl: string | null;
}

export interface CatalogProductCard {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  purpose: string | null;
  category: { slug: string; name: string };
  tags: { slug: string; name: string }[];
  benefits: string[];
  howToUseCount: number;
  priceMinPesos: number | null;
  priceMaxPesos: number | null;
  brands: string[];
  imageUrl: string | null;
  variants: CatalogVariant[];
}

export interface CatalogProductDetail extends CatalogProductCard {
  description: string | null;
  howToUse: string[];
  idealFor: string[];
  usageFrequency: string | null;
  precautions: string[];
  contentNeedsReview: boolean;
  treatments: {
    name: string;
    slug: string;
    tagline: string | null;
    categorySlug: string;
    categoryName: string;
  }[];
  related: CatalogProductCard[];
}

export interface CatalogFacetOption {
  slug: string;
  name: string;
  count: number;
}

export interface CatalogResult {
  items: CatalogProductCard[];
  total: number;
  facets: {
    categories: (CatalogFacetOption & { iconKey: string | null; description: string | null })[];
    tags: CatalogFacetOption[];
    price: { minPesos: number | null; maxPesos: number | null };
  };
}

export interface CatalogFilters {
  category: string | null;
  tags: string[];
  q: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogSort;
}
