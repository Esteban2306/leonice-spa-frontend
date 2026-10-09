import type {
  AdminTreatment,
  CreateTreatmentRequest,
} from "@/src/features/admin/types/treatments.types";

import { pesosInputToThousands, thousandsToPesosInput } from "./catalog";

export interface TreatmentDraft {
  name: string;
  categoryId: string;
  priceMinPesos: string;
  priceMaxPesos: string;
  durationMin: string;
  durationMax: string;
  requiresPriorAssessment: boolean;
  hasHairVariablePricing: boolean;
}

export type TreatmentDraftErrors = Partial<
  Record<"name" | "categoryId" | "price" | "duration", string>
>;

export function emptyTreatmentDraft(categoryId = ""): TreatmentDraft {
  return {
    name: "",
    categoryId,
    priceMinPesos: "",
    priceMaxPesos: "",
    durationMin: "",
    durationMax: "",
    requiresPriorAssessment: false,
    hasHairVariablePricing: false,
  };
}

export function draftFromTreatment(treatment: AdminTreatment): TreatmentDraft {
  return {
    name: treatment.name,
    categoryId: treatment.categoryId,
    priceMinPesos: thousandsToPesosInput(treatment.basePriceMin),
    priceMaxPesos: thousandsToPesosInput(treatment.basePriceMax),
    durationMin: treatment.baseDurationMinMinutes?.toString() ?? "",
    durationMax: treatment.baseDurationMaxMinutes?.toString() ?? "",
    requiresPriorAssessment: treatment.requiresPriorAssessment,
    hasHairVariablePricing: treatment.hasHairVariablePricing,
  };
}

function parseMinutes(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? undefined : Number(digits);
}

function pair(
  low?: number,
  high?: number,
): [number | undefined, number | undefined] {
  return [low ?? high, high ?? low];
}

export function validateTreatmentDraft(draft: TreatmentDraft): {
  errors: TreatmentDraftErrors;
  data: CreateTreatmentRequest | null;
} {
  const errors: TreatmentDraftErrors = {};
  const name = draft.name.trim();
  if (name.length < 2) errors.name = "Escribe un nombre de al menos 2 letras.";
  if (!draft.categoryId) errors.categoryId = "Elige la categoría del servicio.";

  const [priceMin, priceMax] = pair(
    pesosInputToThousands(draft.priceMinPesos),
    pesosInputToThousands(draft.priceMaxPesos),
  );
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    errors.price = "El precio desde no puede ser mayor que el precio hasta.";
  }

  const [durationMin, durationMax] = pair(
    parseMinutes(draft.durationMin),
    parseMinutes(draft.durationMax),
  );
  if (durationMin === undefined) {
    errors.duration = "Indica cuánto dura el servicio en minutos.";
  } else if (durationMin < 1) {
    errors.duration = "La duración debe ser de al menos 1 minuto.";
  } else if (durationMax !== undefined && durationMin > durationMax) {
    errors.duration = "La duración mínima no puede ser mayor que la máxima.";
  }

  if (Object.keys(errors).length > 0) return { errors, data: null };

  return {
    errors,
    data: {
      name,
      categoryId: draft.categoryId,
      requiresPriorAssessment: draft.requiresPriorAssessment,
      hasHairVariablePricing: draft.hasHairVariablePricing,
      ...(priceMin !== undefined && {
        basePriceMin: priceMin,
        basePriceMax: priceMax,
      }),
      baseDurationMinMinutes: durationMin,
      baseDurationMaxMinutes: durationMax,
    },
  };
}

export function isDraftDirty(a: TreatmentDraft, b: TreatmentDraft): boolean {
  return (Object.keys(a) as Array<keyof TreatmentDraft>).some(
    (key) => a[key] !== b[key],
  );
}
