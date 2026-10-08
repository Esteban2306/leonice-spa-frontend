export function ToolbarHeader() {
  return (
    <div className="min-w-0">
      <p className="font-sans text-xs uppercase tracking-[0.22em] text-tertiary">
        Panel administrativo
      </p>

      <h1 className="mt-1 font-heading text-3xl leading-tight text-secondary sm:text-4xl">
        Calendario
      </h1>

      <p className="mt-1 font-sans text-xs text-secondary/60 sm:text-sm">
        Gestiona cada cita, el horario del spa y sus bloqueos.
      </p>
    </div>
  );
}
