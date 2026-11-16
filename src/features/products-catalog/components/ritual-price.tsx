import { ActionLink } from "@/src/features/landing/components/action-link";
import { formatPesos } from "@/src/features/landing/lib/format";
import { whatsappHref } from "@/src/features/landing/lib/site-config";
import type { CatalogRitualSummary } from "@/src/features/products-catalog/api/catalog.types";
import {
  hasSavings,
  itemCountLabel,
  ritualOrderMessage,
  savingsLabel,
} from "@/src/features/products-catalog/lib/ritual-format";

interface RitualPriceProps {
  name: string;
  pricePesos: number | null;
  ritual: CatalogRitualSummary;
  size?: "md" | "lg";
}

export function RitualPrice({ name, pricePesos, ritual, size = "lg" }: RitualPriceProps) {
  const saves = hasSavings(ritual);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {saves && (
          <p className="font-sans text-sm text-[#062112]/70">
            Por separado{" "}
            <s className="tabular-nums decoration-[#7a5a2c]/70">{formatPesos(ritual.separatePricePesos)}</s>
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          {pricePesos !== null && (
            <p className="font-heading text-[clamp(2rem,3.4vw,2.75rem)] leading-none tabular-nums text-[#062112]">
              {formatPesos(pricePesos)}
            </p>
          )}
          {saves && (
            <span className="rounded-full bg-[#062112] px-3 py-1 font-sans text-sm font-bold tabular-nums text-[#E0BC87]">
              {savingsLabel(ritual)}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <ActionLink variant="sand" size={size} href={whatsappHref(ritualOrderMessage(name))}>
          Pedir por WhatsApp
        </ActionLink>
      </div>
      <p className="font-sans text-xs text-[#062112]/70">
        {itemCountLabel(ritual.itemCount)} en un solo pedido. Te confirmamos disponibilidad y entrega por WhatsApp.
      </p>
    </div>
  );
}
