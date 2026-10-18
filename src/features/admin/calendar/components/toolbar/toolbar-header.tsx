import { Plus } from "lucide-react";

import { ToolbarButton } from "./toolbar-button";

interface ToolbarHeaderProps {
  onCreateReservation: () => void;
}

export function ToolbarHeader({ onCreateReservation }: ToolbarHeaderProps) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-tertiary-ink">
          Panel administrativo
        </p>

        <h1 className="mt-1 font-heading text-3xl leading-tight text-secondary sm:text-4xl">
          Calendario
        </h1>

        <p className="mt-1 font-sans text-xs text-secondary/70 sm:text-sm">
          Gestiona cada cita, el horario del spa y sus bloqueos.
        </p>
      </div>

      <ToolbarButton
        icon={Plus}
        variant="solid"
        aria-label="Nueva reserva"
        onClick={onCreateReservation}
        className="shrink-0 max-sm:size-10 max-sm:px-0 sm:hidden"
      >
        <span className="max-sm:sr-only">Nueva reserva</span>
      </ToolbarButton>
    </div>
  );
}
