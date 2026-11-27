import {
  CircleAlert,
  CircleCheck,
  CircleCheckBig,
  CircleX,
  Scissors,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatCopFromThousands } from "@/src/lib/money/cop";

import type { ReservationStage, StageTone } from "../../lib/reservation-stage";

const TONES: Record<StageTone, { icon: LucideIcon; className: string }> = {
  attention: { icon: CircleAlert, className: "bg-amber-100 text-amber-950" },
  ready: { icon: CircleCheck, className: "bg-green-100 text-green-900" },
  active: { icon: Scissors, className: "bg-secondary text-primary" },
  done: { icon: CircleCheckBig, className: "bg-secondary/10 text-secondary" },
  lost: { icon: CircleX, className: "bg-red-100 text-red-900" },
};

export function StatusBadge({ stage }: { stage: ReservationStage }) {
  const { icon: Icon, className } = TONES[stage.tone];

  return (
    <p
      className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-sans text-sm font-bold ${className}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {stage.label}
    </p>
  );
}

interface MoneySummaryProps {
  price: number;
  deposit: number | null;
}

/** La plata de la cita siempre a la vista, antes y después de aprobar. */
export function MoneySummary({ price, deposit }: MoneySummaryProps) {
  const figures = [
    { label: "Precio", value: price },
    { label: "Anticipo recibido", value: deposit },
  ].filter(
    (figure): figure is { label: string; value: number } =>
      figure.value !== null,
  );

  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2 border-y border-secondary/10 py-3">
      {figures.map((figure) => (
        <div key={figure.label}>
          <dt className="font-sans text-sm text-secondary/80">
            {figure.label}
          </dt>
          <dd className="font-sans text-base font-bold tabular-nums text-secondary">
            {formatCopFromThousands(figure.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
