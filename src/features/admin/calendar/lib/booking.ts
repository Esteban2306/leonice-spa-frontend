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
  return services.reduce((sum, service) => sum + service.durationMinutes, 0);
}

export function indexAvailability(
  days: readonly AvailabilityDay[],
): Record<string, AvailabilityDay> {
  return Object.fromEntries(days.map((day) => [day.date, day]));
}

export function describeServices(services: readonly BookingService[]): string {
  return services.map((service) => service.name).join(" + ");
}
