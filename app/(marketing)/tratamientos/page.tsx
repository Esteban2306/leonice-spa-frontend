import type { Metadata } from "next";

import { pageMetadata } from "@/src/features/landing/lib/seo";
import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentCategoriesContainer } from "@/src/features/treatments/pages/categories/treatment-categories-container";

// Sin `revalidate` propio: lo gobiernan los tiempos de los datos (src/lib/cache/revalidate.ts).

export const metadata: Metadata = pageMetadata({
  title: "Tratamientos capilares",
  description:
    "Conoce nuestras categorías de tratamientos en Granada, Meta: spa capilar y spa coreano, con cada procedimiento explicado paso a paso.",
  path: "/tratamientos",
});

export default function TreatmentsPage() {
  return (
    <TreatmentsShell>
      <TreatmentCategoriesContainer />
    </TreatmentsShell>
  );
}
