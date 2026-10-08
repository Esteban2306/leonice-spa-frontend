import { getInitials } from "../../lib/initials";

interface DayPanelHeaderProps {
  date: Date;
  reservationCount: number;
  professionals: readonly string[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function DayPanelHeader({
  date,
  reservationCount,
  professionals,
}: DayPanelHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-secondary p-4 md:p-6 text-primary">
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full border border-quaternary/20" />

      <div className="relative">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-quaternary">
            Reservas del día
          </p>

          <span className="rounded-full bg-primary/10 px-3 py-1 font-sans text-xs">
            {reservationCount} {reservationCount === 1 ? "reserva" : "reservas"}
          </span>
        </div>

        <h2 className="font-heading text-xl capitalize md:text-2xl">
          {DATE_FORMATTER.format(date)}
        </h2>

        {professionals.length > 0 && (
          <div className="mt-3 flex items-center gap-2 md:mt-5">
            {professionals.slice(0, 4).map((name) => (
              <span
                key={name}
                title={name}
                className="grid size-8 place-items-center rounded-full bg-quaternary font-sans text-xs font-medium text-secondary"
              >
                {getInitials(name)}
              </span>
            ))}

            <span className="ml-1 font-sans text-xs text-primary/55">
              Profesionales del día
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
