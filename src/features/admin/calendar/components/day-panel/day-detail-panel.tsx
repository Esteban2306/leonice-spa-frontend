import { Info } from "lucide-react";

import { BrandLoader } from "@/src/components/brand/brand-loader";

import type { ScheduleDay } from "@/src/features/admin/types/schedule.types";

import { groupReservations } from "../../lib/group-reservations";
import type { CalendarReservation } from "../../types/calendar.types";
import { DayPanelHeader } from "./day-panel-header";
import { DayScheduleSection } from "./day-schedule-section";
import { HiddenReservations } from "./hidden-reservations";
import type { DayPanelHandlers } from "./panel-handlers";
import { ReservationGroupCard } from "./reservation-group-card";

interface DayDetailPanelProps extends DayPanelHandlers {
  date: Date;
  reservations: readonly CalendarReservation[];
  hiddenReservations: readonly CalendarReservation[];
  isError: boolean;
  /** Falló la actualización, pero sigue lo último que se cargó. */
  isOutdated: boolean;
  isLoading: boolean;
  onRetry: () => void;
  selectedReservationId: string | null;
  scheduleDay: ScheduleDay | null;
  isScheduleLoading: boolean;
  isSavingSchedule: boolean;
  onSelectReservation: (reservationId: string | null) => void;
  onRemoveException: (exceptionId: string) => Promise<boolean>;
  onRemoveDayOverride: (date: string) => Promise<boolean>;
}

export function DayDetailPanel({
  date,
  reservations,
  hiddenReservations,
  isError,
  isOutdated,
  isLoading,
  onRetry,
  selectedReservationId,
  scheduleDay,
  isScheduleLoading,
  isSavingSchedule,
  onSelectReservation,
  onRemoveException,
  onRemoveDayOverride,
  ...handlers
}: DayDetailPanelProps) {
  const groups = groupReservations(reservations);

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-tertiary/30 bg-[#FCF6EB] md:rounded-[2rem]">
      <DayPanelHeader
        date={date}
        reservations={reservations}
        isLoading={isLoading}
        isError={isError}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 md:p-4">
        <DayScheduleSection
          schedule={scheduleDay}
          isLoading={isScheduleLoading}
          isSaving={isSavingSchedule}
          onRemoveException={onRemoveException}
          onRemoveDayOverride={onRemoveDayOverride}
        />

        {isOutdated && (
          <div
            role="status"
            className="flex items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3 py-2 font-sans text-sm text-amber-950"
          >
            No se pudo actualizar. Puede haber cambios.
            <button
              type="button"
              onClick={onRetry}
              className="min-h-11 shrink-0 cursor-pointer rounded-full px-3 font-bold underline underline-offset-4"
            >
              Actualizar
            </button>
          </div>
        )}

        {isError ? (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 font-sans text-base text-red-800"
          >
            No pudimos cargar las citas de este día. Puede que sí haya.
            <button
              type="button"
              onClick={onRetry}
              className="min-h-11 cursor-pointer rounded-full bg-red-700 px-4 text-white"
            >
              Intentar otra vez
            </button>
          </div>
        ) : isLoading && groups.length === 0 ? (
          <BrandLoader variant="compact" label="Cargando citas…" />
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="mb-3 grid size-10 place-items-center rounded-full bg-secondary/5">
              <Info className="size-4 text-secondary/70" aria-hidden="true" />
            </span>

            <p className="font-sans text-base text-secondary">
              No hay citas activas este día.
            </p>

            <p className="mt-1 max-w-56 font-sans text-sm text-secondary/80">
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

        {!isError && hiddenReservations.length > 0 && (
          <HiddenReservations
            reservations={hiddenReservations}
            selectedReservationId={selectedReservationId}
            onSelectReservation={onSelectReservation}
            {...handlers}
          />
        )}
      </div>
    </aside>
  );
}
