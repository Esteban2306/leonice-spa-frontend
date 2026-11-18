"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  CheckboxField,
  Field,
  INPUT_CLASS,
  TextArea,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import {
  endOfBogotaDay,
  startOfBogotaDay,
  toBogotaDateKey,
} from "@/src/features/admin/services/lib/catalog";
import type {
  PromoEvent,
  SavePromoEventRequest,
} from "@/src/features/admin/types/promo-events.types";

const NAME_MAX = 80;
const DESCRIPTION_MAX = 280;
const PRIZES_MAX = 140;

interface EventDialogProps {
  open: boolean;
  event: PromoEvent | null;
  todayKey: string;
  onOpenChange: (open: boolean) => void;
  onSave: (data: SavePromoEventRequest) => Promise<boolean>;
}

export function EventDialog({
  open,
  event,
  todayKey,
  onOpenChange,
  onSave,
}: EventDialogProps) {
  const [name, setName] = useState(event?.name ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [prizes, setPrizes] = useState(event?.prizes ?? "");
  const [from, setFrom] = useState(
    event ? toBogotaDateKey(event.startsAt) : todayKey,
  );
  const [to, setTo] = useState(event ? toBogotaDateKey(event.endsAt) : "");
  const [ticketsEnabled, setTicketsEnabled] = useState(
    event?.ticketsEnabled ?? true,
  );

  const isValidRange = from !== "" && to !== "" && from <= to;
  const canSubmit =
    name.trim().length >= 3 && description.trim().length >= 10 && isValidRange;

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={event ? "Editar evento" : "Nuevo evento"}
      description="Mientras esté vigente, el asistente de WhatsApp lo conoce y lo explica si le preguntan. Para anunciarlo, crea una campaña con el mensaje “Anuncio de evento”."
      submitLabel={event ? "Guardar evento" : "Crear evento"}
      submittingLabel="Guardando…"
      canSubmit={canSubmit}
      onSubmit={() =>
        onSave({
          name: name.trim(),
          description: description.trim(),
          ...(prizes.trim() ? { prizes: prizes.trim() } : {}),
          startsAt: startOfBogotaDay(from),
          endsAt: endOfBogotaDay(to),
          ticketsEnabled,
        })
      }
    >
      <Field label="Nombre" htmlFor="event-name">
        <input
          id="event-name"
          value={name}
          maxLength={NAME_MAX}
          placeholder="Ej. Rifa de aniversario"
          onChange={(e) => setName(e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <Field
        label="Cómo participar"
        htmlFor="event-description"
        hint={`${description.length}/${DESCRIPTION_MAX}. Es lo que el asistente y los anuncios le cuentan a la clienta.`}
      >
        <TextArea
          id="event-description"
          value={description}
          maxLength={DESCRIPTION_MAX}
          placeholder="Por cada visita durante noviembre recibes una boleta numerada para la rifa del 30 de noviembre."
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>
      <Field
        label="Premios (opcional)"
        htmlFor="event-prizes"
        hint={`${prizes.length}/${PRIZES_MAX}`}
      >
        <input
          id="event-prizes"
          value={prizes}
          maxLength={PRIZES_MAX}
          placeholder="Kit de productos, un ritual completo y un bono de hidratación"
          onChange={(e) => setPrizes(e.target.value)}
          className={INPUT_CLASS}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Desde" htmlFor="event-from">
          <input
            id="event-from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
        <Field label="Hasta" htmlFor="event-to">
          <input
            id="event-to"
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>
      </div>
      {from !== "" && to !== "" && !isValidRange && (
        <p role="alert" className="font-sans text-xs text-red-700">
          La fecha final debe ser igual o posterior a la inicial.
        </p>
      )}
      <CheckboxField
        id="event-tickets"
        checked={ticketsEnabled}
        onChange={setTicketsEnabled}
        label="Entregar boletas numeradas"
        description="Cada visita completada durante el evento recibe una boleta y la clienta la recibe por WhatsApp. Al final haces el sorteo desde aquí."
      />
    </ActionDialog>
  );
}
