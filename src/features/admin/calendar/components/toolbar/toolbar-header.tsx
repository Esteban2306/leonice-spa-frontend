import { Plus } from "lucide-react";

import { ToolbarButton } from "./toolbar-button";

interface ToolbarHeaderProps {
  onCreateReservation: () => void;
}

export function ToolbarHeader({ onCreateReservation }: ToolbarHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 sm:gap-4">
      <div className="min-w-0">
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-tertiary">
          Panel administrativo
        </p>

        <h1 className="mt-1 font-heading text-3xl leading-tight text-secondary sm:text-4xl">
          Calendario
        </h1>

        <p className="mt-1 font-sans text-xs text-secondary/60 sm:text-sm">
          Gestiona las citas confirmadas y la agenda del spa.
        </p>
      </div>

      <ToolbarButton
        icon={Plus}
        variant="solid"
        aria-label="Nueva reserva"
        onClick={onCreateReservation}
        className="shrink-0 max-sm:size-10 max-sm:px-0"
      >
        <span className="max-sm:sr-only">Nueva reserva</span>
      </ToolbarButton>
    </div>
  );
}
