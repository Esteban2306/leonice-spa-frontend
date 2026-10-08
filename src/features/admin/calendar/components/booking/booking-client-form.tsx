"use client";

import { useState, type FormEvent } from "react";
import { Search, UserRound, X } from "lucide-react";

import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import type { ClientListItem } from "@/src/features/admin/types/clients.types";

import type { BookingClient } from "../../types/calendar.types";

export interface BookingClientSearch {
  query: string;
  results: readonly ClientListItem[];
  isSearching: boolean;
  onQueryChange: (query: string) => void;
}

export interface NewClientValues {
  phone: string;
  name: string;
  birthDate: string;
}

interface BookingClientFormProps {
  presetClient: BookingClient | null;
  search: BookingClientSearch;
  isSubmitting: boolean;
  onSubmit: (client: BookingClient | null, values: NewClientValues) => void;
}

const MIN_PHONE_DIGITS = 10;

export function BookingClientForm({
  presetClient,
  search,
  isSubmitting,
  onSubmit,
}: BookingClientFormProps) {
  const [picked, setPicked] = useState<BookingClient | null>(presetClient);
  const [values, setValues] = useState<NewClientValues>({
    phone: "",
    name: "",
    birthDate: "",
  });

  const phoneDigits = values.phone.replace(/\D/g, "").length;
  const canSubmit = picked
    ? true
    : phoneDigits >= MIN_PHONE_DIGITS &&
      values.name.trim().length >= 2 &&
      values.birthDate !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSubmit && !isSubmitting) onSubmit(picked, values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {picked ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-secondary/15 bg-white p-3">
          <span className="flex min-w-0 items-center gap-2">
            <UserRound className="size-4 shrink-0 text-secondary/60" />
            <span className="min-w-0">
              <span className="block truncate font-sans text-sm text-secondary">
                {picked.name}
              </span>
              <span className="block font-sans text-xs text-secondary/55">
                {picked.phone}
              </span>
            </span>
          </span>
          {!presetClient && (
            <button
              type="button"
              onClick={() => setPicked(null)}
              aria-label="Elegir otro cliente"
              className="grid size-7 cursor-pointer place-items-center rounded-full text-secondary/60 hover:bg-secondary/5"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      ) : (
        <>
          <Field label="Cliente existente" htmlFor="booking-client-search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary/45" />
              <input
                id="booking-client-search"
                type="search"
                value={search.query}
                onChange={(event) => search.onQueryChange(event.target.value)}
                placeholder="Nombre o teléfono"
                className={`${INPUT_CLASS} pl-9`}
              />
            </div>
          </Field>

          {search.query.trim().length >= 2 && (
            <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
              {search.isSearching && (
                <p className="px-1 font-sans text-xs text-secondary/55">
                  Buscando…
                </p>
              )}
              {!search.isSearching && search.results.length === 0 && (
                <p className="px-1 font-sans text-xs text-secondary/55">
                  Sin coincidencias. Registra los datos del cliente nuevo abajo.
                </p>
              )}
              {search.results.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() =>
                    setPicked({
                      id: client.id,
                      name: client.name,
                      phone: client.phone,
                    })
                  }
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-sm text-secondary hover:bg-quaternary/25"
                >
                  {client.name}
                  <span className="text-xs text-secondary/55">
                    {client.phone}
                  </span>
                </button>
              ))}
            </div>
          )}

          <p className="font-sans text-xs uppercase tracking-[0.16em] text-secondary/45">
            O cliente nuevo
          </p>
          <Field label="Teléfono" htmlFor="booking-phone">
            <input
              id="booking-phone"
              inputMode="tel"
              value={values.phone}
              onChange={(event) =>
                setValues({ ...values, phone: event.target.value })
              }
              placeholder="300 123 4567"
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Nombre completo" htmlFor="booking-name">
            <input
              id="booking-name"
              value={values.name}
              maxLength={100}
              onChange={(event) =>
                setValues({ ...values, name: event.target.value })
              }
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Fecha de nacimiento" htmlFor="booking-birth">
            <input
              id="booking-birth"
              type="date"
              value={values.birthDate}
              onChange={(event) =>
                setValues({ ...values, birthDate: event.target.value })
              }
              className={INPUT_CLASS}
            />
          </Field>
        </>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="h-11 cursor-pointer rounded-full bg-secondary font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Creando reserva…" : "Crear reserva"}
      </button>
    </form>
  );
}
