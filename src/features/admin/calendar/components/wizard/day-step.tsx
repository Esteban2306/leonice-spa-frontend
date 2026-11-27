import { BrandLoader } from "@/src/components/brand/brand-loader";
import type { AvailabilityDay } from "@/src/features/admin/types/reservations.types";

import { formatDayChoice } from "../../lib/booking-wizard";
import { ErrorBox, OptionButton, SECONDARY_BUTTON } from "./wizard-parts";

interface DayStepProps {
  days: readonly AvailabilityDay[];
  today: Date;
  selectedKey: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (dayKey: string) => void;
  onEarlier: (() => void) | null;
  onLater: (() => void) | null;
}

export function DayStep({
  days,
  today,
  selectedKey,
  isLoading,
  isError,
  onRetry,
  onSelect,
  onEarlier,
  onLater,
}: DayStepProps) {
  if (isError) {
    return (
      <ErrorBox
        message="No pudimos consultar los días libres."
        actionLabel="Intentar otra vez"
        onAction={onRetry}
      />
    );
  }
  if (isLoading) {
    return <BrandLoader variant="compact" label="Buscando días libres…" />;
  }

  const open = days.filter((day) => day.available && day.slots.length > 0);

  return (
    <>
      {onEarlier && (
        <button type="button" onClick={onEarlier} className={SECONDARY_BUTTON}>
          Ver fechas anteriores
        </button>
      )}
      <div className="flex flex-col gap-2">
        {open.length === 0 && (
          <p className="font-sans text-base text-secondary/80">
            No hay días libres en estas fechas.
          </p>
        )}
        {open.map((day) => (
          <OptionButton
            key={day.date}
            title={formatDayChoice(day.date, today)}
            detail={
              day.slots.length === 1
                ? "1 hora libre"
                : `${day.slots.length} horas libres`
            }
            selected={day.date === selectedKey}
            onClick={() => onSelect(day.date)}
          />
        ))}
      </div>
      {onLater && (
        <button type="button" onClick={onLater} className={SECONDARY_BUTTON}>
          Ver fechas más adelante
        </button>
      )}
    </>
  );
}
