import type { CalendarReservation } from "../../types/calendar.types";

interface ReservationDetailsProps {
  reservation: CalendarReservation;
}

const PRICE_FORMATTER = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface DetailFieldProps {
  label: string;
  value: string;
  align?: "left" | "right";
}

function DetailField({ label, value, align = "left" }: DetailFieldProps) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <p className="font-sans text-[10px] uppercase tracking-wide text-secondary/40">
        {label}
      </p>
      <p className="mt-1 font-sans text-xs text-secondary">{value}</p>
    </div>
  );
}

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <DetailField label="Teléfono" value={reservation.phone} />
      <DetailField label="Categoría" value={reservation.category} />
      <DetailField label="Profesional" value={reservation.professionalName} />
      <DetailField
        label="Precio"
        value={PRICE_FORMATTER.format(reservation.price)}
        align="right"
      />
    </div>
  );
}
