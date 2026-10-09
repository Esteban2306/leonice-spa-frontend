import { formatCopFromThousands } from "@/src/lib/money/cop";
import type { HairColor, HairLength } from "@/src/features/admin/types/enums";
import type { CatalogStatus } from "@/src/features/admin/types/catalog.types";
import type { Promotion } from "@/src/features/admin/types/promotions.types";
import type {
  AdminTreatment,
  FindAdminTreatmentsParams,
  TreatmentSortField,
} from "@/src/features/admin/types/treatments.types";

const MINUTES_PER_HOUR = 60;
const BOGOTA_OFFSET = "-05:00";

export const HAIR_LENGTHS: readonly HairLength[] = [
  "CORTO",
  "MEDIANO",
  "LARGO",
];
export const HAIR_COLORS: readonly HairColor[] = ["CLARO", "OSCURO"];

export const HAIR_LENGTH_LABELS: Record<HairLength, string> = {
  CORTO: "Corto",
  MEDIANO: "Mediano",
  LARGO: "Largo",
};

export const HAIR_COLOR_LABELS: Record<HairColor, string> = {
  CLARO: "Claro",
  OSCURO: "Oscuro",
};

export type SortOption =
  "name" | "price-asc" | "price-desc" | "duration" | "recent";

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> =
  [
    { value: "name", label: "Nombre" },
    { value: "price-asc", label: "Precio: menor a mayor" },
    { value: "price-desc", label: "Precio: mayor a menor" },
    { value: "duration", label: "Duración" },
    { value: "recent", label: "Editados recientemente" },
  ];

const SORT_PARAMS: Record<
  SortOption,
  { sortBy: TreatmentSortField; sortOrder: "asc" | "desc" }
> = {
  name: { sortBy: "name", sortOrder: "asc" },
  "price-asc": { sortBy: "price", sortOrder: "asc" },
  "price-desc": { sortBy: "price", sortOrder: "desc" },
  duration: { sortBy: "duration", sortOrder: "asc" },
  recent: { sortBy: "updatedAt", sortOrder: "desc" },
};

export interface CatalogFilters {
  q: string;
  status: CatalogStatus;
  hasActivePromotion: boolean;
  hasHairVariablePricing: boolean;
  requiresPriorAssessment: boolean;
  withoutPrice: boolean;
  priceMinPesos: string;
  priceMaxPesos: string;
  durationMin: string;
  durationMax: string;
  sort: SortOption;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  q: "",
  status: "ACTIVE",
  hasActivePromotion: false,
  hasHairVariablePricing: false,
  requiresPriorAssessment: false,
  withoutPrice: false,
  priceMinPesos: "",
  priceMaxPesos: "",
  durationMin: "",
  durationMax: "",
  sort: "name",
};

function parsePositive(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return undefined;
  return Number(digits);
}

export function pesosInputToThousands(raw: string): number | undefined {
  const pesos = parsePositive(raw);
  return pesos === undefined ? undefined : pesos / 1000;
}

export function buildTreatmentParams(
  filters: CatalogFilters,
): FindAdminTreatmentsParams {
  const q = filters.q.trim();
  return {
    q: q.length >= 2 ? q : undefined,
    status: filters.status,
    hasActivePromotion: filters.hasActivePromotion || undefined,
    hasHairVariablePricing: filters.hasHairVariablePricing || undefined,
    requiresPriorAssessment: filters.requiresPriorAssessment || undefined,
    hasPrice: filters.withoutPrice ? false : undefined,
    priceMin: pesosInputToThousands(filters.priceMinPesos),
    priceMax: pesosInputToThousands(filters.priceMaxPesos),
    durationMin: parsePositive(filters.durationMin),
    durationMax: parsePositive(filters.durationMax),
    ...SORT_PARAMS[filters.sort],
  };
}

export function countActiveFilters(filters: CatalogFilters): number {
  return [
    filters.status !== DEFAULT_FILTERS.status,
    filters.hasActivePromotion,
    filters.hasHairVariablePricing,
    filters.requiresPriorAssessment,
    filters.withoutPrice,
    filters.priceMinPesos !== "" || filters.priceMaxPesos !== "",
    filters.durationMin !== "" || filters.durationMax !== "",
  ].filter(Boolean).length;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

export function formatDurationRange(
  min: number | null,
  max: number | null,
): string | null {
  const low = min ?? max;
  const high = max ?? min;
  if (low === null || high === null) return null;
  if (low === high) return formatDuration(low);
  return `${formatDuration(low)} – ${formatDuration(high)}`;
}

export function formatPriceRange(
  min: string | number | null | undefined,
  max: string | number | null | undefined,
): string | null {
  const low = min ?? max;
  const high = max ?? min;
  if (low == null || high == null) return null;
  if (Number(low) === Number(high)) return formatCopFromThousands(low);
  return `${formatCopFromThousands(low)} – ${formatCopFromThousands(high)}`;
}

const PESOS_GROUPING = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export function formatPesosInput(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? "" : PESOS_GROUPING.format(Number(digits));
}

export function thousandsToPesosInput(value: string | number | null): string {
  if (value === null || value === "") return "";
  return formatPesosInput(String(Math.round(Number(value) * 1000)));
}

export interface HairPriceRange {
  priceMin: number;
  priceMax: number;
  minutesMin: number;
  minutesMax: number;
}

export function hairPriceRange(
  treatment: Pick<
    AdminTreatment,
    "hasHairVariablePricing" | "hairLengthPricing" | "hairColorSurcharges"
  >,
): HairPriceRange | null {
  if (
    !treatment.hasHairVariablePricing ||
    treatment.hairLengthPricing.length === 0
  ) {
    return null;
  }
  const prices = treatment.hairLengthPricing.map((row) => Number(row.price));
  const minutes = treatment.hairLengthPricing.map((row) => row.durationMinutes);
  const surcharges = treatment.hairColorSurcharges.map((row) =>
    Number(row.surcharge),
  );
  const extras = treatment.hairColorSurcharges.map(
    (row) => row.extraDurationMinutes,
  );
  return {
    priceMin: Math.min(...prices) + Math.min(0, ...surcharges),
    priceMax: Math.max(...prices) + Math.max(0, ...surcharges),
    minutesMin: Math.min(...minutes),
    minutesMax: Math.max(...minutes) + Math.max(0, ...extras),
  };
}

export function groupTreatmentsByCategory(
  treatments: readonly AdminTreatment[],
): Map<string, AdminTreatment[]> {
  const groups = new Map<string, AdminTreatment[]>();
  for (const treatment of treatments) {
    const group = groups.get(treatment.categoryId);
    if (group) group.push(treatment);
    else groups.set(treatment.categoryId, [treatment]);
  }
  return groups;
}

export type PromotionState = "CURRENT" | "UPCOMING" | "EXPIRED" | "INACTIVE";

export const PROMOTION_STATE_LABELS: Record<PromotionState, string> = {
  CURRENT: "Vigente",
  UPCOMING: "Programada",
  EXPIRED: "Vencida",
  INACTIVE: "Desactivada",
};

export function promotionState(
  promotion: Pick<Promotion, "isActive" | "startsAt" | "endsAt">,
  nowMs: number,
): PromotionState {
  if (!promotion.isActive) return "INACTIVE";
  if (new Date(promotion.startsAt).getTime() > nowMs) return "UPCOMING";
  if (new Date(promotion.endsAt).getTime() < nowMs) return "EXPIRED";
  return "CURRENT";
}

export function promotionsForTreatment(
  promotions: readonly Promotion[],
  treatment: Pick<AdminTreatment, "id" | "categoryId">,
): Promotion[] {
  return promotions.filter(
    (promotion) =>
      promotion.treatmentId === treatment.id ||
      (promotion.treatmentId === null &&
        promotion.categoryId === treatment.categoryId),
  );
}

export function startOfBogotaDay(dateKey: string): string {
  return `${dateKey}T00:00:00${BOGOTA_OFFSET}`;
}

export function endOfBogotaDay(dateKey: string): string {
  return `${dateKey}T23:59:59${BOGOTA_OFFSET}`;
}

export function toBogotaDateKey(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

const SHORT_DATE = new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota",
  day: "numeric",
  month: "short",
});

export function formatPromotionWindow(
  startsAt: string,
  endsAt: string,
): string {
  return `${SHORT_DATE.format(new Date(startsAt))} – ${SHORT_DATE.format(new Date(endsAt))}`;
}
