import { getShowcaseCategories } from "@/src/features/treatments/api/showcase.api";
import { TreatmentCategoriesView } from "@/src/features/treatments/pages/categories/treatment-categories-view";

export async function TreatmentCategoriesContainer() {
  const categories = await getShowcaseCategories();
  return <TreatmentCategoriesView categories={categories} />;
}
