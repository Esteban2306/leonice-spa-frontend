import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  icon,
  aside,
  children,
  className,
  id,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "flex flex-col gap-4 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-5 sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icon && (
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-quaternary">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h2
              id={id ? `${id}-title` : undefined}
              className="font-heading text-2xl leading-tight text-secondary"
            >
              {title}
            </h2>
            {description && (
              <div className="mt-1 font-sans text-sm text-secondary/75">
                {description}
              </div>
            )}
          </div>
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-[1.5rem] border border-dashed border-tertiary/50 px-6 py-10 text-center">
      <p className="font-heading text-xl text-secondary">{title}</p>
      {children && (
        <div className="max-w-md font-sans text-sm text-secondary/70">
          {children}
        </div>
      )}
    </div>
  );
}

export function SkeletonRows({
  rows = 3,
  height = "h-16",
}: {
  rows?: number;
  height?: string;
}) {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={cn("animate-pulse rounded-2xl bg-secondary/5", height)}
        />
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  );
}

export const PRIMARY_BUTTON =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-secondary px-5 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

export const SECONDARY_BUTTON =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-secondary/20 bg-white px-5 font-sans text-sm text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

export const DANGER_LINK =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-4 font-sans text-sm text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50";

export const LABEL =
  "font-sans text-xs uppercase tracking-[0.16em] text-secondary/70";
