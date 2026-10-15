import type { Metadata } from "next";

import { getShowcaseTreatment } from "@/src/features/treatments/api/showcase.api";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentDetailContainer } from "@/src/features/treatments/pages/treatment/treatment-detail-container";

export const revalidate = 300;

type Params = Promise<{ categoria: string; tratamiento: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { categoria, tratamiento } = await params;
  const treatment = await getShowcaseTreatment(categoria, tratamiento).catch(() => null);
  if (!treatment) return { title: "Tratamientos · Leonice Arenas Spa Capilar" };
  return {
    title: `${treatment.name} · ${treatment.category.name} · Leonice Arenas Spa Capilar`,
    description: treatment.summary ?? treatment.tagline ?? undefined,
    openGraph: treatment.posterUrl ? { images: [{ url: treatment.posterUrl }] } : undefined,
  };
}

export default async function TreatmentDetailPage({ params }: { params: Params }) {
  const { categoria, tratamiento } = await params;
  return (
    <TreatmentsShell>
      <TreatmentDetailContainer categorySlug={categoria} treatmentSlug={tratamiento} />
    </TreatmentsShell>
  );
}
