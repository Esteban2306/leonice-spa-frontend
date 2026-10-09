import { Ban, CalendarClock, CalendarOff, CalendarPlus2 } from "lucide-react";

import type { ScheduleActionHandlers } from "../../types/calendar.types";
import { ToolbarButton } from "./toolbar-button";

export function ScheduleActions({
  onBlockDay,
  onBlockHours,
  onOpenExtraHours,
  onEditWeeklySchedule,
}: ScheduleActionHandlers) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ToolbarButton icon={CalendarOff} onClick={onBlockDay}>
        Bloquear día
      </ToolbarButton>

      <ToolbarButton icon={Ban} onClick={onBlockHours}>
        Bloquear horas
      </ToolbarButton>

      <ToolbarButton icon={CalendarPlus2} onClick={onOpenExtraHours}>
        Horario extra
      </ToolbarButton>

      <ToolbarButton icon={CalendarClock} onClick={onEditWeeklySchedule}>
        Horario semanal
      </ToolbarButton>
    </div>
  );
}
