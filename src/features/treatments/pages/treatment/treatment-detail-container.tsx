import { notFound } from "next/navigation";

import { getShowcaseTreatment } from "@/src/features/treatments/api/showcase.api";
import { TreatmentDetailView } from "@/src/features/treatments/pages/treatment/treatment-detail-view";

export async function TreatmentDetailContainer({
  categorySlug,
  treatmentSlug,
}: {
  categorySlug: string;
  treatmentSlug: string;
}) {
  const treatment = await getShowcaseTreatment(categorySlug, treatmentSlug);
  if (!treatment) notFound();
  return <TreatmentDetailView treatment={treatment} />;
}
