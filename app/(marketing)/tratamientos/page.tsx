import type { Metadata } from "next";

import { TreatmentsShell } from "@/src/features/treatments/components/treatments-shell";
import { TreatmentCategoriesContainer } from "@/src/features/treatments/pages/categories/treatment-categories-container";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tratamientos · Leonice Arenas Spa Capilar",
  description:
    "Conoce nuestras categorías de tratamientos: spa capilar, spa coreano y uñas, con cada procedimiento explicado paso a paso.",
};

export default function TreatmentsPage() {
  return (
    <TreatmentsShell>
      <TreatmentCategoriesContainer />
    </TreatmentsShell>
  );
}
