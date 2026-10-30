import type {
  HairColor,
  HairDensity,
  HairLength,
} from "@/src/features/admin/types/enums";

export const HAIR_LENGTH_OPTIONS: ReadonlyArray<{
  value: HairLength;
  label: string;
}> = [
  { value: "CORTO", label: "Corto" },
  { value: "MEDIANO", label: "Mediano" },
  { value: "LARGO", label: "Largo" },
];

export const HAIR_COLOR_OPTIONS: ReadonlyArray<{
  value: HairColor;
  label: string;
}> = [
  { value: "CLARO", label: "Claro" },
  { value: "OSCURO", label: "Oscuro" },
];

export const HAIR_DENSITY_OPTIONS: ReadonlyArray<{
  value: HairDensity;
  label: string;
}> = [
  { value: "BAJA", label: "Baja" },
  { value: "MEDIA", label: "Media" },
  { value: "ALTA", label: "Alta" },
];

export const HAIR_DENSITY_LABELS: Readonly<Record<HairDensity, string>> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
};

export const HAIR_DENSITY_HINT =
  "Cantidad de cabello. Baja: se ve con facilidad el cuero cabelludo. Media: cantidad promedio. Alta: cabello abundante y espeso.";
