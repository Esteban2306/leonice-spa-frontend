import {
  CircleAlert,
  CircleCheck,
  CircleCheckBig,
  CircleX,
  Scissors,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ReservationStage, StageTone } from "../../lib/reservation-stage";

const TONES: Record<StageTone, { icon: LucideIcon; className: string }> = {
  attention: { icon: CircleAlert, className: "bg-amber-100 text-amber-950" },
  ready: { icon: CircleCheck, className: "bg-secondary/10 text-secondary" },
  active: { icon: Scissors, className: "bg-secondary text-primary" },
  done: { icon: CircleCheckBig, className: "bg-green-100 text-green-900" },
  lost: { icon: CircleX, className: "bg-red-100 text-red-900" },
};

/** Recorrido de la cita y, en palabras, qué está pasando ahora. */
export function StageSummary({ stage }: { stage: ReservationStage }) {
  const { icon: Icon, className } = TONES[stage.tone];
  const current = stage.steps?.find((step) => step.state === "current");
  const next =
    current && stage.steps?.[stage.steps.indexOf(current) + 1];

  return (
    <div className="flex flex-col gap-2">
      {stage.steps && (
        <div className="flex flex-col gap-1">
          <div aria-hidden="true" className="flex gap-1">
            {stage.steps.map((step) => (
              <span
                key={step.label}
                className={`h-1.5 flex-1 rounded-full ${
                  step.state === "done"
                    ? "bg-secondary"
                    : step.state === "current"
                      ? "bg-tertiary"
                      : "bg-secondary/15"
                }`}
              />
            ))}
          </div>
          {current && (
            <p className="font-sans text-sm text-secondary/80">
              Paso {stage.steps.indexOf(current) + 1} de {stage.steps.length}:{" "}
              <strong className="text-secondary">{current.label}</strong>
              {next && ` · sigue ${next.label.toLowerCase()}`}
            </p>
          )}
        </div>
      )}

      <p
        className={`flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm font-bold ${className}`}
      >
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {stage.headline}
      </p>
    </div>
  );
}
