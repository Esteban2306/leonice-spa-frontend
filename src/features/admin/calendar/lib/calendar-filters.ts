import type { Category } from "@/src/features/admin/types/categories.types";
import type { ReservationStatus } from "@/src/features/admin/types/enums";

import type {
  CalendarFilter,
  CalendarFilterGroup,
  CalendarReservation,
} from "../types/calendar.types";

const STATUS_FILTERS: ReadonlyArray<{
  status: ReservationStatus;
  label: string;
}> = [
  { status: "PENDIENTE_DEPOSITO", label: "Esperando depósito" },
  { status: "CONFIRMADA", label: "Confirmadas" },
  { status: "CITA_EN_CURSO", label: "En curso" },
  { status: "COMPLETADA", label: "Completadas" },
  { status: "NO_SHOW", label: "No asistió" },
  { status: "CANCELADA", label: "Canceladas" },
];

const ATTENTION_FILTERS: ReadonlyArray<CalendarFilter> = [
  {
    id: "attention:proof-review",
    label: "Comprobante por revisar",
    group: "attention",
  },
  { id: "attention:combo", label: "Combos", group: "attention" },
];

const HIDDEN_BY_DEFAULT: readonly ReservationStatus[] = [
  "CANCELADA",
  "REPROGRAMADA",
];

export const CALENDAR_FILTER_GROUPS: ReadonlyArray<{
  id: CalendarFilterGroup;
  label: string;
}> = [
  { id: "status", label: "Estado" },
  { id: "category", label: "Categoría" },
  { id: "attention", label: "Atención" },
];

export function buildCalendarFilters(
  categories: readonly Category[],
): CalendarFilter[] {
  return [
    ...STATUS_FILTERS.map(({ status, label }) => ({
      id: `status:${status}`,
      label,
      group: "status" as const,
    })),
    ...categories.map((category) => ({
      id: `category:${category.id}`,
      label: category.name,
      group: "category" as const,
    })),
    ...ATTENTION_FILTERS,
  ];
}

function matchesFilter(
  reservation: CalendarReservation,
  filterId: string,
): boolean {
  const [kind, value] = filterId.split(":");

  switch (kind) {
    case "status":
      return reservation.status === value;
    case "category":
      return reservation.categoryId === value;
    case "attention":
      if (value === "proof-review") return reservation.isProofUnderReview;
      if (value === "combo") return reservation.comboGroupId !== null;
      return false;
    default:
      return false;
  }
}

function groupOf(filterId: string): string {
  return filterId.split(":")[0];
}

function matchesSearch(reservation: CalendarReservation, query: string) {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) return true;

  const digits = normalized.replace(/\D/g, "");

  return (
    reservation.clientName.toLowerCase().includes(normalized) ||
    reservation.treatmentName.toLowerCase().includes(normalized) ||
    (digits.length >= 3 &&
      reservation.phone.replace(/\D/g, "").includes(digits))
  );
}

export function matchesFilters(
  reservation: CalendarReservation,
  activeIds: readonly string[],
  searchQuery = "",
): boolean {
  if (!matchesSearch(reservation, searchQuery)) return false;

  const statusFilters = activeIds.filter((id) => groupOf(id) === "status");
  if (
    statusFilters.length === 0 &&
    HIDDEN_BY_DEFAULT.includes(reservation.status)
  ) {
    return false;
  }

  const groups = new Set(activeIds.map(groupOf));

  return Array.from(groups).every((group) =>
    activeIds.some(
      (id) => groupOf(id) === group && matchesFilter(reservation, id),
    ),
  );
}
