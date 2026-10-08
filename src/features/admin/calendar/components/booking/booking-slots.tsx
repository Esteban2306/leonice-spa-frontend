import type { AvailabilitySlot } from "@/src/features/admin/types/reservations.types";

interface BookingSlotsProps {
  slots: readonly AvailabilitySlot[];
  selectedIso: string | null;
  onSelect: (iso: string) => void;
}

export function BookingSlots({
  slots,
  selectedIso,
  onSelect,
}: BookingSlotsProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Horarios disponibles"
      className="grid grid-cols-3 gap-2"
    >
      {slots.map((slot) => {
        const isSelected = slot.iso === selectedIso;
        return (
          <button
            key={slot.iso}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(slot.iso)}
            className={`h-10 cursor-pointer rounded-full border font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
              isSelected
                ? "border-secondary bg-secondary text-primary"
                : "border-secondary/15 bg-white text-secondary hover:bg-quaternary/25"
            }`}
          >
            {slot.localTime}
          </button>
        );
      })}
    </div>
  );
}
