import { formatDuration, formatThousandsCop } from "@/src/features/landing/lib/format";
import type { ShowcasePrice } from "@/src/features/treatments/api/showcase.types";

export interface PriceDisplay {
  label: string | null;
  original: string | null;
  promotionName: string | null;
  discountPercentage: number | null;
}

function rangeLabel(from: number | null, to: number | null): string | null {
  if (from === null) return null;
  if (to === null || to === from) return formatThousandsCop(from);
  return `${formatThousandsCop(from)} – ${formatThousandsCop(to)}`;
}

export function priceDisplay(price: ShowcasePrice): PriceDisplay {
  const base = rangeLabel(price.fromThousands, price.toThousands);
  if (!price.promotion) {
    return { label: base, original: null, promotionName: null, discountPercentage: null };
  }
  return {
    label: rangeLabel(price.promotion.fromThousands, price.promotion.toThousands) ?? base,
    original: base,
    promotionName: price.promotion.name,
    discountPercentage: price.promotion.discountPercentage,
  };
}

export function priceFromLabel(fromThousands: number | null): string | null {
  return fromThousands === null ? null : `Desde ${formatThousandsCop(fromThousands)}`;
}

export function durationLabel(minMinutes: number | null, maxMinutes: number | null): string | null {
  if (minMinutes === null && maxMinutes === null) return null;
  const min = minMinutes ?? maxMinutes!;
  const max = maxMinutes ?? minMinutes!;
  if (min === max) return formatDuration(min);
  return `${formatDuration(min)} – ${formatDuration(max)}`;
}

export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function bookingMessage(treatmentName?: string, categoryName?: string): string {
  if (treatmentName) return `Hola, quiero agendar ${treatmentName} en Leonice.`;
  if (categoryName) return `Hola, quiero agendar un servicio de ${categoryName} en Leonice.`;
  return "Hola, quiero agendar una cita en Leonice.";
}

export function assessmentMessage(treatmentName: string): string {
  return `Hola, quiero agendar la valoración para ${treatmentName} en Leonice.`;
}
