import type { ReactNode } from "react";

interface CalendarSurfaceProps {
  toolbar: ReactNode;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  children: ReactNode;
}

export function CalendarSurface({
  toolbar,
  isLoading,
  isError,
  onRetry,
  children,
}: CalendarSurfaceProps) {
  return (
    <section
      aria-label="Calendario"
      className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-tertiary/30 bg-[#FCF6EB] sm:rounded-[2rem]"
    >
      <div className="border-b border-tertiary/20 p-4 sm:p-6">{toolbar}</div>

      {isError && (
        <div
          role="alert"
          className="mx-2 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800 sm:mx-4 sm:mt-4"
        >
          No se pudieron cargar las reservas del calendario.
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
          >
            Reintentar
          </button>
        </div>
      )}

      <div
        aria-busy={isLoading}
        className={`min-h-0 flex-1 overflow-y-auto p-2 transition-opacity sm:p-4 ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {children}
      </div>
    </section>
  );
}
