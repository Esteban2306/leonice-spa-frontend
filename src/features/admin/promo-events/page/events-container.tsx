"use client";

import { useMemo, useState } from "react";

import {
  usePromoEventActions,
  usePromoEvents,
} from "@/src/features/admin/hooks/use-promo-events";
import {
  ConfirmToggleDialog,
  type ToggleConfirmation,
} from "@/src/features/admin/services/components/confirm-toggle-dialog";
import type { PromoEvent } from "@/src/features/admin/types/promo-events.types";
import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";

import { DrawDialog } from "../components/draw-dialog";
import { EventDialog } from "../components/event-dialog";
import { sortEvents } from "../lib/events-page";
import { EventsView } from "./events-view";

interface DialogState {
  open: boolean;
  version: number;
  event: PromoEvent | null;
}

export function EventsContainer() {
  const nowMs = useMinuteClock();
  const todayKey = getBogotaDayKey(new Date(nowMs));
  const query = usePromoEvents();
  const actions = usePromoEventActions();
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    version: 0,
    event: null,
  });
  const [drawing, setDrawing] = useState<PromoEvent | null>(null);
  const [drawVersion, setDrawVersion] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ToggleConfirmation | null>(
    null,
  );

  const events = useMemo(
    () => sortEvents(query.data ?? [], nowMs),
    [query.data, nowMs],
  );

  const open = (event: PromoEvent | null) =>
    setDialog((current) => ({
      open: true,
      version: current.version + 1,
      event,
    }));

  return (
    <>
      <EventsView
        events={events}
        isLoading={query.isLoading}
        isError={query.isError}
        nowMs={nowMs}
        expandedId={expandedId}
        onToggleExpand={(id) =>
          setExpandedId((current) => (current === id ? null : id))
        }
        onCreate={() => open(null)}
        onEdit={(event) => open(event)}
        onToggleActive={(event) =>
          setConfirmation(
            event.isActive
              ? {
                  title: `Desactivar ${event.name}`,
                  description:
                    "El asistente deja de mencionarlo, las campañas que lo anuncian se pausan y las visitas nuevas ya no reciben boleta. Las boletas entregadas se conservan.",
                  submitLabel: "Desactivar evento",
                  onConfirm: () =>
                    actions.update(event.id, { isActive: false }),
                }
              : {
                  title: `Activar ${event.name}`,
                  description:
                    "Vuelve a estar disponible para el asistente y para las boletas dentro de sus fechas.",
                  submitLabel: "Activar evento",
                  onConfirm: () => actions.update(event.id, { isActive: true }),
                },
          )
        }
        onDelete={(event) =>
          setConfirmation({
            title: `¿Eliminar ${event.name}?`,
            description:
              "Se borra por completo. Solo es posible mientras no tenga boletas ni campañas. No se puede deshacer.",
            submitLabel: "Eliminar evento",
            onConfirm: () => actions.remove(event.id),
          })
        }
        onDraw={(event) => {
          setDrawVersion((v) => v + 1);
          setDrawing(event);
        }}
        onRetry={() => void query.refetch()}
      />

      <EventDialog
        key={`event-${dialog.version}`}
        open={dialog.open}
        event={dialog.event}
        todayKey={todayKey}
        onOpenChange={(next) =>
          setDialog((current) => ({ ...current, open: next }))
        }
        onSave={(data) =>
          dialog.event
            ? actions.update(dialog.event.id, data)
            : actions.create(data)
        }
      />

      <DrawDialog
        key={`draw-${drawVersion}`}
        event={drawing}
        onOpenChange={(next) => {
          if (!next) setDrawing(null);
        }}
        onDraw={async (prize) => {
          if (!drawing) return false;
          const winner = await actions.draw(drawing.id, prize);
          if (winner) setExpandedId(drawing.id);
          return winner !== null;
        }}
      />

      <ConfirmToggleDialog
        confirmation={confirmation}
        onClose={() => setConfirmation(null)}
      />
    </>
  );
}
