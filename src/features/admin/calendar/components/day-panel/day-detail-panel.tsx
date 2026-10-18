import { Info } from "lucide-react";

import type { ScheduleDay } from "@/src/features/admin/types/schedule.types";

import { groupReservations } from "../../lib/group-reservations";
import type { CalendarReservation } from "../../types/calendar.types";
import { DayPanelHeader } from "./day-panel-header";
import { DayScheduleSection } from "./day-schedule-section";
import type { DayPanelHandlers } from "./panel-handlers";
import { ReservationGroupCard } from "./reservation-group-card";

interface DayDetailPanelProps extends DayPanelHandlers {
  date: Date;
  reservations: readonly CalendarReservation[];
  selectedReservationId: string | null;
  scheduleDay: ScheduleDay | null;
  isScheduleLoading: boolean;
  isSavingSchedule: boolean;
  onSelectReservation: (reservationId: string | null) => void;
  onRemoveException: (exceptionId: string) => Promise<boolean>;
}

export function DayDetailPanel({
  date,
  reservations,
  selectedReservationId,
  scheduleDay,
  isScheduleLoading,
  isSavingSchedule,
  onSelectReservation,
  onRemoveException,
  ...handlers
}: DayDetailPanelProps) {
  const groups = groupReservations(reservations);

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-tertiary/30 bg-[#FCF6EB] md:rounded-[2rem]">
      <DayPanelHeader date={date} reservations={reservations} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 md:p-4">
        <DayScheduleSection
          schedule={scheduleDay}
          isLoading={isScheduleLoading}
          isSaving={isSavingSchedule}
          onRemoveException={(id) => void onRemoveException(id)}
        />

        {groups.length === 0 ? (
          <div className="flex min-h-48 flex-1 flex-col items-center justify-center text-center">
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-secondary/5">
              <Info className="size-4 text-secondary/70" />
            </span>

            <p className="font-sans text-sm text-secondary">
              No hay reservas para este día.
            </p>

            <p className="mt-1 max-w-56 font-sans text-xs text-secondary/70">
              Revisa los filtros activos o selecciona otro día.
            </p>
          </div>
        ) : (
          groups.map((group) => (
            <ReservationGroupCard
              key={group.id}
              group={group}
              selectedReservationId={selectedReservationId}
              onSelectReservation={onSelectReservation}
              {...handlers}
            />
          ))
        )}
      </div>
    </aside>
  );
}
