import type { CalendarViewMode } from "../../types/calendar.types";

interface WeekdayHeaderProps {
  variant: CalendarViewMode;
}

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;

const LAYOUT: Record<CalendarViewMode, string> = {
  month: "grid grid-cols-7 gap-1 md:gap-2",
  week: "hidden md:grid md:grid-cols-7 md:gap-2",
};

export function WeekdayHeader({ variant }: WeekdayHeaderProps) {
  return (
    <div className={LAYOUT[variant]} aria-hidden="true">
      {WEEKDAYS.map((weekday) => (
        <span
          key={weekday}
          className="text-center font-sans text-[10px] uppercase tracking-widest text-secondary/70 md:text-[11px] md:tracking-[0.18em]"
        >
          {weekday}
        </span>
      ))}
    </div>
  );
}
