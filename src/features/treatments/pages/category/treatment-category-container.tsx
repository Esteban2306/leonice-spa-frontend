import { notFound } from "next/navigation";

import { getShowcaseCategories, getShowcaseCategory } from "@/src/features/treatments/api/showcase.api";
import { TreatmentCategoryView } from "@/src/features/treatments/pages/category/treatment-category-view";

export async function TreatmentCategoryContainer({ categorySlug }: { categorySlug: string }) {
  const [category, categories] = await Promise.all([
    getShowcaseCategory(categorySlug),
    getShowcaseCategories(),
  ]);
  if (!category) notFound();
  return (
    <TreatmentCategoryView
      category={category}
      otherCategories={categories.filter((other) => other.slug !== category.slug)}
    />
  );
}
