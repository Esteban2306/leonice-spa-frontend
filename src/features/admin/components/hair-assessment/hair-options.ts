import type { HairColor, HairLength } from "@/src/features/admin/types/enums";

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
