import type { Metadata } from "next";

import { pageMetadata } from "@/src/features/landing/lib/seo";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentCategoriesContainer } from "@/src/features/treatments/pages/categories/treatment-categories-container";

export const revalidate = 300;

export const metadata: Metadata = pageMetadata({
  title: "Tratamientos capilares",
  description:
    "Conoce nuestras categorías de tratamientos en Granada, Meta: spa capilar, spa coreano y uñas, con cada procedimiento explicado paso a paso.",
  path: "/tratamientos",
});

export default function TreatmentsPage() {
  return (
    <TreatmentsShell>
      <TreatmentCategoriesContainer />
    </TreatmentsShell>
  );
}
