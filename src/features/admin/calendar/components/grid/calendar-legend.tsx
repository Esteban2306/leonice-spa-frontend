export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-5 px-1 pt-1 font-sans text-xs text-secondary/60">
      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded-full bg-tertiary" />
        Hoy
      </span>

      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded-full border border-tertiary/60" />
        Con reservas
      </span>

      <span className="inline-flex items-center gap-2">
        <span className="size-3 rounded-full bg-secondary" />
        Seleccionado
      </span>
    </div>
  );
}
