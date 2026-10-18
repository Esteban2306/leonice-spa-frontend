import type { Metadata } from "next";

import { JsonLd } from "@/src/components/seo/json-ld";
import { pageMetadata } from "@/src/features/landing/lib/seo";
import { breadcrumbJsonLd, serviceJsonLd } from "@/src/features/landing/lib/structured-data";
import { getShowcaseTreatment } from "@/src/features/treatments/api/showcase.api";
import { categoryHref, treatmentHref } from "@/src/features/treatments/lib/showcase-routes";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentDetailContainer } from "@/src/features/treatments/pages/treatment/treatment-detail-container";

export const revalidate = 300;

type Params = Promise<{ categoria: string; tratamiento: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria, tratamiento } = await params;
  const treatment = await getShowcaseTreatment(categoria, tratamiento).catch(() => null);
  if (!treatment) return { title: "Tratamientos" };
  return pageMetadata({
    title: `${treatment.name} · ${treatment.category.name}`,
    description: treatment.summary ?? treatment.tagline,
    path: treatmentHref(treatment.categorySlug, treatment.slug),
    image: treatment.posterUrl,
  });
}

export default async function TreatmentDetailPage({ params }: { params: Params }) {
  const { categoria, tratamiento } = await params;
  const treatment = await getShowcaseTreatment(categoria, tratamiento).catch(() => null);
  const price = treatment?.price.promotion ?? treatment?.price;
  return (
    <TreatmentsShell>
      {treatment && (
        <>
          <JsonLd
            data={serviceJsonLd({
              name: treatment.name,
              description: treatment.summary ?? treatment.tagline,
              path: treatmentHref(treatment.categorySlug, treatment.slug),
              categoryName: treatment.category.name,
              image: treatment.posterUrl,
              priceFromPesos: price?.fromThousands != null ? price.fromThousands * 1000 : null,
              priceToPesos: price?.toThousands != null ? price.toThousands * 1000 : null,
            })}
          />
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Inicio", path: "/" },
              { name: "Tratamientos", path: "/tratamientos" },
              { name: treatment.category.name, path: categoryHref(treatment.categorySlug) },
              { name: treatment.name, path: treatmentHref(treatment.categorySlug, treatment.slug) },
            ])}
          />
        </>
      )}
      <TreatmentDetailContainer categorySlug={categoria} treatmentSlug={tratamiento} />
    </TreatmentsShell>
  );
}
