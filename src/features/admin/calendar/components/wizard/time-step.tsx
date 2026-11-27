import { BrandLoader } from "@/src/components/brand/brand-loader";
import type { AvailabilitySlot } from "@/src/features/admin/types/reservations.types";

import { splitSlots } from "../../lib/booking-wizard";
import { ErrorBox } from "./wizard-parts";

interface TimeStepProps {
  dayLabel: string;
  slots: readonly AvailabilitySlot[];
  selectedIso: string | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onSelect: (iso: string) => void;
}

export function TimeStep({
  dayLabel,
  slots,
  selectedIso,
  isLoading,
  isError,
  onRetry,
  onSelect,
}: TimeStepProps) {
  if (isError) {
    return (
      <ErrorBox
        message="No pudimos consultar las horas libres."
        actionLabel="Intentar otra vez"
        onAction={onRetry}
      />
    );
  }
  if (isLoading) {
    return <BrandLoader variant="compact" label="Buscando horas libres…" />;
  }

  const { morning, afternoon } = splitSlots(slots);
  const groups = [
    { title: "En la mañana", slots: morning },
    { title: "En la tarde", slots: afternoon },
  ].filter((group) => group.slots.length > 0);

  return (
    <>
      <p className="font-sans text-base text-secondary/80">{dayLabel}</p>
      {groups.length === 0 && (
        <p className="font-sans text-base text-secondary/80">
          Ese día ya no tiene horas libres. Toca “Atrás” y elige otro.
        </p>
      )}
      {groups.map((group) => (
        <section key={group.title} className="flex flex-col gap-2">
          <h2 className="font-sans text-lg font-bold text-secondary">
            {group.title}
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.slots.map((slot) => (
              <button
                key={slot.iso}
                type="button"
                aria-pressed={slot.iso === selectedIso}
                onClick={() => onSelect(slot.iso)}
                className={`min-h-12 cursor-pointer rounded-full border font-sans text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
                  slot.iso === selectedIso
                    ? "border-secondary bg-secondary text-primary"
                    : "border-secondary/25 bg-white text-secondary hover:bg-quaternary/25"
                }`}
              >
                {slot.localTime}
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
