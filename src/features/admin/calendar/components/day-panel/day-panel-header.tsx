import type { CalendarReservation } from "../../types/calendar.types";

interface DayPanelHeaderProps {
  date: Date;
  reservations: readonly CalendarReservation[];
  isLoading: boolean;
  isError: boolean;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

function summarize(reservations: readonly CalendarReservation[]): string {
  const total = reservations.length;
  if (total === 0) return "Sin citas";

  const unpaid = reservations.filter(
    (r) => r.status === "PENDIENTE_DEPOSITO",
  ).length;
  const inSpa = reservations.filter(
    (r) => r.status === "CITA_EN_CURSO",
  ).length;

  return [
    total === 1 ? "1 cita" : `${total} citas`,
    unpaid > 0 ? `${unpaid} por cobrar` : null,
    inSpa > 0 ? `${inSpa} en el spa` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function DayPanelHeader({
  date,
  reservations,
  isLoading,
  isError,
}: DayPanelHeaderProps) {
  const label = DATE_FORMATTER.format(date);

  return (
    <header className="bg-secondary p-4 text-primary md:p-5">
      <h2 className="font-heading text-2xl">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </h2>
      <p className="mt-1 font-sans text-sm text-primary/85">
        {isError
          ? "No se pudo cargar"
          : isLoading && reservations.length === 0
            ? "Cargando…"
            : summarize(reservations)}
      </p>
    </header>
  );
}
