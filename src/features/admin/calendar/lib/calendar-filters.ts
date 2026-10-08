import type {
  CalendarFilter,
  CalendarFilterGroup,
  CalendarReservation,
} from "../types/calendar.types";

export const AVAILABLE_FILTERS: CalendarFilter[] = [
  { id: "confirmadas", label: "Confirmadas", group: "status" },
  { id: "agendadas", label: "Agendadas", group: "status" },
  { id: "capilar", label: "Tratamiento capilar", group: "category" },
  { id: "color", label: "Color", group: "category" },
  { id: "spa", label: "Spa", group: "category" },
];

const PREDICATES: Record<
  string,
  (reservation: CalendarReservation) => boolean
> = {
  confirmadas: (r) => r.status === "CONFIRMADA",
  agendadas: (r) => r.status === "AGENDADA",
  capilar: (r) => r.category === "Tratamiento capilar",
  color: (r) => r.category === "Color",
  spa: (r) => r.category === "Spa",
};

export function matchesFilters(
  reservation: CalendarReservation,
  activeIds: readonly string[],
): boolean {
  const active = AVAILABLE_FILTERS.filter((filter) =>
    activeIds.includes(filter.id),
  );

  const groups = new Set<CalendarFilterGroup>(active.map((f) => f.group));

  return Array.from(groups).every((group) =>
    active.some(
      (filter) => filter.group === group && PREDICATES[filter.id](reservation),
    ),
  );
}
