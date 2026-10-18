import { CalendarCog, CalendarOff } from "lucide-react";

interface CalendarLegendProps {
  mode: "browse" | "booking";
}

export function CalendarLegend({ mode }: CalendarLegendProps) {
  if (mode === "booking") {
    return (
      <div className="flex flex-wrap items-center gap-5 px-1 pt-1 font-sans text-xs text-secondary/70">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full border border-green-700 bg-white" />
          Disponible para lo que estás agendando
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-secondary/10" />
          No disponible
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded-full bg-secondary" />
          Seleccionado
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-5 px-1 pt-1 font-sans text-xs text-secondary/70">
      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded-full bg-tertiary" />
        Hoy
      </span>

      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded-full bg-secondary" />
        Seleccionado
      </span>

      <span className="inline-flex items-center gap-2">
        <CalendarOff className="size-3.5 text-red-700" />
        Día bloqueado
      </span>

      <span className="inline-flex items-center gap-2">
        <CalendarCog className="size-3.5 text-tertiary" />
        Horario modificado
      </span>
    </div>
  );
}
