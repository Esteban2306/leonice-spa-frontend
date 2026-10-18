import { CalendarOff, Clock, Trash2 } from "lucide-react";

import type {
  ScheduleDay,
  ScheduleException,
} from "@/src/features/admin/types/schedule.types";

interface DayScheduleSectionProps {
  schedule: ScheduleDay | null;
  isLoading: boolean;
  isSaving: boolean;
  onRemoveException: (exceptionId: string) => void;
}

function describeException(exception: ScheduleException): string {
  const scope = exception.categoryName ? exception.categoryName : "Todo el spa";
  const span = exception.allDay
    ? "todo el día"
    : `${exception.startTime}–${exception.endTime}`;
  const kind = exception.type === "BLOCK" ? "Bloqueo" : "Horario extra";
  return `${kind} · ${scope} · ${span}`;
}

export function DayScheduleSection({
  schedule,
  isLoading,
  isSaving,
  onRemoveException,
}: DayScheduleSectionProps) {
  if (isLoading || !schedule) {
    return (
      <p className="px-1 font-sans text-xs text-secondary/70">
        {isLoading ? "Cargando horario del día…" : null}
      </p>
    );
  }

  return (
    <section
      aria-label="Horario del día"
      className="flex flex-col gap-2 rounded-2xl border border-secondary/10 bg-white/60 p-3"
    >
      <div className="flex items-center gap-2 font-sans text-xs text-secondary">
        {schedule.isClosed ? (
          <>
            <CalendarOff className="size-4 text-red-700" />
            <span className="font-medium text-red-800">
              Spa cerrado este día
            </span>
          </>
        ) : (
          <>
            <Clock className="size-4 text-secondary/70" />
            <span>
              Horario:{" "}
              {schedule.windows
                .map((window) => `${window.startTime}–${window.endTime}`)
                .join(" · ")}
            </span>
          </>
        )}
      </div>

      {schedule.exceptions.map((exception) => (
        <div
          key={exception.id}
          className="flex items-start justify-between gap-2 rounded-xl bg-quaternary/20 px-3 py-2"
        >
          <span className="font-sans text-xs text-secondary">
            {describeException(exception)}
            {exception.reason && (
              <span className="block text-secondary/70">
                {exception.reason}
              </span>
            )}
          </span>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => onRemoveException(exception.id)}
            aria-label={`Quitar ${describeException(exception)}`}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
    </section>
  );
}
