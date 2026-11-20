import { CalendarCog, CalendarOff, Clock, Trash2 } from "lucide-react";

import type {
  ScheduleDay,
  ScheduleException,
} from "@/src/features/admin/types/schedule.types";
import { BrandLoader } from "@/src/components/brand/brand-loader";

interface DayScheduleSectionProps {
  schedule: ScheduleDay | null;
  isLoading: boolean;
  isSaving: boolean;
  onRemoveException: (exceptionId: string) => void;
  onRemoveDayOverride: (date: string) => void;
}

function describeOverride(override: NonNullable<ScheduleDay["override"]>) {
  if (override.isClosed) return "Horario especial: cerrado";
  const windows = override.windows
    .map((w) => `${w.startTime}–${w.endTime}`)
    .join(" · ");
  const starts =
    override.startTimes.length > 0
      ? ` · Citas solo a las ${override.startTimes.join(", ")}`
      : "";
  return `Horario especial: ${windows}${starts}`;
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
  onRemoveDayOverride,
}: DayScheduleSectionProps) {
  if (isLoading || !schedule) {
    return isLoading ? (
      <BrandLoader
        variant="compact"
        label="Cargando horario del día…"
        className="px-1"
      />
    ) : (
      <p className="px-1" />
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

      {schedule.override && (
        <div className="flex items-start justify-between gap-2 rounded-xl bg-tertiary/15 px-3 py-2">
          <span className="flex gap-2 font-sans text-xs text-secondary">
            <CalendarCog className="mt-0.5 size-3.5 shrink-0 text-secondary/70" />
            <span>
              {describeOverride(schedule.override)}
              {schedule.override.reason && (
                <span className="block text-secondary/70">
                  {schedule.override.reason}
                </span>
              )}
            </span>
          </span>
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onRemoveDayOverride(schedule.date)}
            aria-label="Quitar el horario especial de esta fecha"
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}

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
