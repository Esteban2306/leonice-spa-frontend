import type { Metadata } from "next";

import { getShowcaseCategory } from "@/src/features/treatments/api/showcase.api";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentCategoryContainer } from "@/src/features/treatments/pages/category/treatment-category-container";

export const revalidate = 300;

type Params = Promise<{ categoria: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getShowcaseCategory(categoria).catch(() => null);
  if (!category) return { title: "Tratamientos · Leonice Arenas Spa Capilar" };
  return {
    title: `${category.name} · Leonice Arenas Spa Capilar`,
    description: category.tagline ?? category.description ?? undefined,
  };
}

export default async function TreatmentCategoryPage({ params }: { params: Params }) {
  const { categoria } = await params;
  return (
    <TreatmentsShell>
      <TreatmentCategoryContainer categorySlug={categoria} />
    </TreatmentsShell>
  );
}
