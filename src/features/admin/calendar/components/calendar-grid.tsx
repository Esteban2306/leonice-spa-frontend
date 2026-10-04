import * as React from "react";
import type { DayButtonProps } from "react-day-picker";
import { CalendarDayButton } from "@/src/components/ui/calendar";
import { Calendar } from "@/src/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { CalendarReservation } from "../types/calendar.types";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  reservations: CalendarReservation[];
  onSelectDate: (date: Date) => void;
  onMonthChange: (month: Date) => void;
}

interface CalendarEventDayButtonProps extends DayButtonProps {
  reservations: CalendarReservation[];
}

function CalendarEventDayButton({
  day,
  modifiers,
  reservations,
  ...props
}: CalendarEventDayButtonProps) {
  return (
    <CalendarDayButton
      {...props}
      day={day}
      modifiers={modifiers}
      className={cn(
        "h-full min-h-24 items-start justify-start gap-1 rounded-lg p-2 text-left",
        modifiers.selected && "bg-[#062112] text-[#F2EBDB] hover:bg-[#062112]",
      )}
    >
      <span className="text-sm font-medium">{day.date.getDate()}</span>

      <div className="flex w-full flex-col gap-1 overflow-hidden">
        {reservations.slice(0, 2).map((reservation) => (
          <div
            key={reservation.id}
            className={cn(
              "w-full truncate rounded border-l-2 border-[#BF9250] bg-[#F2EBDB] px-1.5 py-1 text-[10px] leading-tight text-[#062112]",
              modifiers.selected &&
                "border-[#E0BC87] bg-[#F2EBDB]/10 text-[#F2EBDB]",
            )}
          >
            <span className="font-medium">{reservation.start}</span>{" "}
            {reservation.treatmentName}
          </div>
        ))}

        {reservations.length > 2 && (
          <span className="px-1 text-[10px] text-[#062112]/55">
            + {reservations.length - 2} más
          </span>
        )}
      </div>
    </CalendarDayButton>
  );
}

function getDateKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function CalendarGrid({
  currentMonth,
  selectedDate,
  reservations,
  onSelectDate,
  onMonthChange,
}: CalendarGridProps) {
  return (
    <div className="min-h-0 overflow-hidden rounded-xl border border-[#062112]/10 bg-[#F7F2E8] p-3">
      <Calendar
        mode="single"
        month={currentMonth}
        selected={selectedDate}
        onSelect={(date) => {
          if (date) {
            onSelectDate(date);
          }
        }}
        onMonthChange={onMonthChange}
        showOutsideDays
        fixedWeeks
        className="w-full [--cell-size:8rem]"
        classNames={{
          months: "w-full",
          month: "w-full gap-3",
          month_grid: "w-full",
          weekdays: "mb-2 flex w-full",
          weekday:
            "flex-1 text-center text-[10px] uppercase tracking-[0.16em] text-[#062112]/45",
          week: "mt-2 flex w-full gap-2",
          day: "relative flex-1 rounded-lg",
        }}
        components={{
          DayButton: (props) => {
            const dateKey = getDateKey(props.day.date);

            const dayReservations = reservations.filter((reservation) => {
              const reservationDate = new Date(
                `2026-10-${String(
                  Number(reservation.id.split("-")[1]) + 12,
                ).padStart(2, "0")}T${reservation.start}:00`,
              );

              return getDateKey(reservationDate) === dateKey;
            });

            return (
              <CalendarEventDayButton
                {...props}
                reservations={dayReservations}
              />
            );
          },
        }}
      />
    </div>
  );
}
