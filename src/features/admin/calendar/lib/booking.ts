import { formatCopFromThousands } from "@/src/lib/money/cop";
import type {
  AvailabilityDay,
  AvailabilityDayReason,
} from "@/src/features/admin/types/reservations.types";
import type { Treatment } from "@/src/features/admin/types/treatments.types";

import type { BookingService } from "../types/calendar.types";

export const AVAILABILITY_REASON_LABELS: Readonly<
  Record<AvailabilityDayReason, string>
> = {
  TOO_SOON: "Fuera de plazo",
  OUT_OF_RANGE: "Muy lejos",
  CLOSED: "Cerrado",
  FULL: "Sin cupo",
};

const DEFAULT_DURATION_MINUTES = 60;

export function treatmentDuration(treatment: Treatment): number {
  return (
    treatment.baseDurationMaxMinutes ??
    treatment.baseDurationMinMinutes ??
    DEFAULT_DURATION_MINUTES
  );
}

export function priceRangeLabel(treatment: Treatment): string | null {
  const min = treatment.basePriceMin;
  const max = treatment.basePriceMax;
  const single = max || min;
  if (!single) return null;
  if (min && max && min !== max) {
    return `${formatCopFromThousands(min)} – ${formatCopFromThousands(max)}`;
  }
  return formatCopFromThousands(single);
}

export function toBookingService(
  treatment: Treatment,
  categoryName: string,
): BookingService {
  return {
    treatmentId: treatment.id,
    name: treatment.name,
    categoryName,
    durationMinutes: treatmentDuration(treatment),
  };
}

export function totalDuration(services: readonly BookingService[]): number {
  return services.reduce(
    (longest, service) => Math.max(longest, service.durationMinutes),
    0,
  );
}

export function indexAvailability(
  days: readonly AvailabilityDay[],
): Record<string, AvailabilityDay> {
  return Object.fromEntries(days.map((day) => [day.date, day]));
}

export function describeServices(services: readonly BookingService[]): string {
  return services.map((service) => service.name).join(" + ");
}

/** Mismo rango que valida la API para el precio de una reserva. */
export const MIN_AGREED_PRICE = 1_000;
export const MAX_AGREED_PRICE = 1_000_000;

export function isAgreedPriceInRange(price: number): boolean {
  return price >= MIN_AGREED_PRICE && price <= MAX_AGREED_PRICE;
}

export function toAgreedPrices(
  prices: Readonly<Record<string, string>>,
): Array<{ treatmentId: string; price: number }> {
  return Object.entries(prices).flatMap(([treatmentId, raw]) => {
    const digits = raw.replace(/\D/g, "");
    if (digits === "") return [];
    const price = Number(digits);
    return isAgreedPriceInRange(price) ? [{ treatmentId, price }] : [];
  });
}
