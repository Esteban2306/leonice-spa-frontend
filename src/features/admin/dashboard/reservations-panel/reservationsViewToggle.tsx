import type { DashboardView } from "@/src/features/admin/types/dashboard.types";

import { DASHBOARD_VIEWS } from "../lib/dashboard-views";

interface ReservationsViewToggleProps {
  view: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function ReservationsViewToggle({
  view,
  onViewChange,
}: ReservationsViewToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Vista de reservas"
      className="flex w-full flex-wrap items-center gap-1 rounded-[1.25rem] border border-secondary/15 bg-white p-1 sm:inline-flex sm:w-auto sm:rounded-full"
    >
      {DASHBOARD_VIEWS.map((option) => {
        const isActive = option.id === view;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onViewChange(option.id)}
            className={`h-9 flex-1 cursor-pointer whitespace-nowrap rounded-full px-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary sm:flex-none ${
              isActive
                ? "bg-secondary text-primary"
                : "text-secondary/65 hover:bg-secondary/5"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
