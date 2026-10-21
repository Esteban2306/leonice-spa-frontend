import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { pageMetadata } from "@/src/features/landing/lib/seo";
import { breadcrumbJsonLd } from "@/src/features/landing/lib/structured-data";
import { getShowcaseCategories, getShowcaseCategory } from "@/src/features/treatments/api/showcase.api";
import { categoryHref } from "@/src/features/treatments/lib/showcase-routes";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentCategoryContainer } from "@/src/features/treatments/pages/category/treatment-category-container";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getShowcaseCategories().catch(() => []);
  return categories.map((category) => ({ categoria: category.slug }));
}

type Params = Promise<{ categoria: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getShowcaseCategory(categoria).catch(() => null);
  if (!category) return { title: "Tratamientos" };
  return pageMetadata({
    title: category.name,
    description: category.tagline ?? category.description,
    path: categoryHref(category.slug),
    image: category.posterUrl,
  });
}

export default async function TreatmentCategoryPage({ params }: { params: Params }) {
  const { categoria } = await params;
  const category = await getShowcaseCategory(categoria).catch(() => null);
  return (
    <TreatmentsShell>
      {category && (
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Tratamientos", path: "/tratamientos" },
            { name: category.name, path: categoryHref(category.slug) },
          ])}
        />
      )}
      <TreatmentCategoryContainer categorySlug={categoria} />
    </TreatmentsShell>
  );
}
