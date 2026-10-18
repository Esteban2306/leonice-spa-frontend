import { ArrowUpRight, LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { formatCopFromThousands } from "@/src/lib/money/cop";

type DashboardMetricCardVariant = "default" | "featured";
type DashboardMetricCardFormat = "number" | "currency";

interface DashboardMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  isLoading?: boolean;
  description?: string;
  footer?: ReactNode;
  badge?: string;
  variant?: DashboardMetricCardVariant;
  format?: DashboardMetricCardFormat;
}

function formatMetricValue(
  value: number,
  format: DashboardMetricCardFormat,
): string {
  if (format === "currency") {
    return formatCopFromThousands(value);
  }

  return new Intl.NumberFormat("es-CO").format(value);
}

export function DashboardMetricCard({
  icon: Icon,
  label,
  value,
  isLoading = false,
  description,
  footer,
  badge,
  variant = "default",
  format = "number",
}: DashboardMetricCardProps) {
  const formattedValue = isLoading ? "—" : formatMetricValue(value, format);

  const isFeatured = variant === "featured";

  return (
    <article
      className={[
        "relative flex max-h-50 flex-col overflow-hidden rounded-[2rem] border p-4",
        "transition-transform duration-300 ease-out",
        "hover:-translate-y-0.5",
        isFeatured
          ? "border-secondary bg-secondary text-primary"
          : "border-tertiary/30 bg-[#FCF6EB] text-secondary",
      ].join(" ")}
    >
      {isFeatured && (
        <>
          <div className="pointer-events-none absolute -right-12 -top-20 size-52 rounded-full border border-tertiary/30" />

          <div className="pointer-events-none absolute -right-4 -top-8 size-36 rounded-full border border-tertiary/25" />
        </>
      )}

      <div className="relative flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            className={
              isFeatured
                ? "size-5 shrink-0 text-primary"
                : "size-5 shrink-0 text-secondary/70"
            }
            strokeWidth={1.8}
          />

          <span
            className={[
              "truncate font-sans text-sm uppercase tracking-[0.18em]",
              isFeatured ? "text-primary/80" : "text-secondary/65",
            ].join(" ")}
          >
            {label}
          </span>
        </div>

        {badge && (
          <span
            className="
              shrink-0
              rounded-full
              border
              border-tertiary/40
              px-4
              py-2
              font-sans
              text-sm
              text-tertiary
            "
          >
            {badge}
          </span>
        )}

        {!badge && (
          <span
            className={[
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              isFeatured
                ? "bg-tertiary text-secondary"
                : "bg-quaternary/40 text-secondary",
            ].join(" ")}
          >
            <ArrowUpRight className="size-5" strokeWidth={1.8} />
          </span>
        )}
      </div>

      <div className="relative mt-2 flex flex-col gap-3">
        <p
          aria-busy={isLoading}
          className={[
            "font-sans text-4xl leading-none tracking-tight sm:text-5xl",
            isLoading ? "animate-pulse opacity-50" : "",
            isFeatured ? "text-primary" : "text-secondary",
          ].join(" ")}
        >
          {formattedValue}
        </p>

        {description && (
          <p
            className={[
              " font-sans text-[16px]",
              isFeatured ? "text-primary/70" : "text-secondary/65",
            ].join(" ")}
          >
            {description}
          </p>
        )}

        {footer && (
          <div
            className={[
              "flex flex-wrap items-center gap-2 font-sans text-sm",
              isFeatured ? "text-primary/60" : "text-secondary/70",
            ].join(" ")}
          >
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}
