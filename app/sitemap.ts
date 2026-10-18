import type { MetadataRoute } from "next";

import { getCatalog } from "@/src/features/products-catalog/api/catalog.api";
import { EMPTY_FILTERS } from "@/src/features/products-catalog/lib/catalog-filters";
import { absoluteUrl } from "@/src/features/landing/lib/seo";
import { DATA_POLICY_PATH, DATA_POLICY_REVIEWED } from "@/src/features/legal/data-policy";
import { getShowcaseCategories, getShowcaseCategory } from "@/src/features/treatments/api/showcase.api";
import { categoryHref, treatmentHref } from "@/src/features/treatments/lib/showcase-routes";

export const revalidate = 3600;

async function treatmentEntries(): Promise<MetadataRoute.Sitemap> {
  const categories = await getShowcaseCategories().catch(() => []);
  const details = await Promise.all(
    categories.map((category) => getShowcaseCategory(category.slug).catch(() => null)),
  );
  return categories.flatMap((category, index) => [
    { url: absoluteUrl(categoryHref(category.slug)), changeFrequency: "weekly" as const, priority: 0.8 },
    ...(details[index]?.treatments ?? []).map((treatment) => ({
      url: absoluteUrl(treatmentHref(treatment.categorySlug, treatment.slug)),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]);
}

async function productEntries(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog(EMPTY_FILTERS).catch(() => null);
  return (catalog?.items ?? []).map((product) => ({
    url: absoluteUrl(`/productos/${product.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [treatments, products] = await Promise.all([treatmentEntries(), productEntries()]);
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/tratamientos"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/productos"), changeFrequency: "weekly", priority: 0.6 },
    ...(DATA_POLICY_REVIEWED
      ? [{ url: absoluteUrl(DATA_POLICY_PATH), changeFrequency: "yearly" as const, priority: 0.2 }]
      : []),
    ...treatments,
    ...products,
  ];
}
