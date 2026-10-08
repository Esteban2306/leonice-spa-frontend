import type { ReactNode } from "react";

interface CalendarSurfaceProps {
  toolbar: ReactNode;
  children: ReactNode;
}

export function CalendarSurface({ toolbar, children }: CalendarSurfaceProps) {
  return (
    <section
      aria-label="Calendario"
      className="flex min-h-0 flex-col overflow-hidden rounded-3xl sm:rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB]"
    >
      <div className="border-b border-tertiary/20 p-4 sm:p-6">{toolbar}</div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-4">
        {children}
      </div>
    </section>
  );
}
