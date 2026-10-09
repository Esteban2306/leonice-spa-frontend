"use client";

import { useState } from "react";

import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import type { HairPricingInput } from "@/src/features/admin/hooks/use-catalog-actions";
import type { HairColor, HairLength } from "@/src/features/admin/types/enums";
import type { AdminTreatment } from "@/src/features/admin/types/treatments.types";

import {
  HAIR_COLORS,
  HAIR_COLOR_LABELS,
  HAIR_LENGTHS,
  HAIR_LENGTH_LABELS,
  formatPesosInput,
  pesosInputToThousands,
  thousandsToPesosInput,
} from "../lib/catalog";

interface HairPricingEditorProps {
  treatment: AdminTreatment;
  isSaving: boolean;
  onSave: (input: HairPricingInput) => Promise<boolean>;
}

type LengthRow = { price: string; minutes: string };
type ColorRow = { surcharge: string; minutes: string };

function initialLengths(
  treatment: AdminTreatment,
): Record<HairLength, LengthRow> {
  const byLength = new Map(
    treatment.hairLengthPricing.map((row) => [row.hairLength, row]),
  );
  return Object.fromEntries(
    HAIR_LENGTHS.map((length) => {
      const row = byLength.get(length);
      return [
        length,
        {
          price: row ? thousandsToPesosInput(row.price) : "",
          minutes: row ? String(row.durationMinutes) : "",
        },
      ];
    }),
  ) as Record<HairLength, LengthRow>;
}

function initialColors(treatment: AdminTreatment): Record<HairColor, ColorRow> {
  const byColor = new Map(
    treatment.hairColorSurcharges.map((row) => [row.hairColor, row]),
  );
  return Object.fromEntries(
    HAIR_COLORS.map((color) => {
      const row = byColor.get(color);
      return [
        color,
        {
          surcharge: row ? thousandsToPesosInput(row.surcharge) : "0",
          minutes: row ? String(row.extraDurationMinutes) : "0",
        },
      ];
    }),
  ) as Record<HairColor, ColorRow>;
}

function toMinutes(raw: string): number | undefined {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? undefined : Number(digits);
}

const CELL_INPUT = `${INPUT_CLASS} h-10 tabular-nums`;

export function HairPricingEditor({
  treatment,
  isSaving,
  onSave,
}: HairPricingEditorProps) {
  const [lengths, setLengths] = useState(() => initialLengths(treatment));
  const [colors, setColors] = useState(() => initialColors(treatment));

  const lengthEntries = HAIR_LENGTHS.map((hairLength) => ({
    hairLength,
    price: pesosInputToThousands(lengths[hairLength].price),
    durationMinutes: toMinutes(lengths[hairLength].minutes),
  }));
  const colorEntries = HAIR_COLORS.map((hairColor) => ({
    hairColor,
    surcharge: pesosInputToThousands(colors[hairColor].surcharge) ?? 0,
    extraDurationMinutes: toMinutes(colors[hairColor].minutes) ?? 0,
  }));
  const isComplete = lengthEntries.every(
    (entry) => entry.price !== undefined && (entry.durationMinutes ?? 0) >= 1,
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!isComplete || isSaving) return;
        void onSave({
          enableVariablePricing: !treatment.hasHairVariablePricing,
          lengths: lengthEntries.map((entry) => ({
            hairLength: entry.hairLength,
            price: entry.price ?? 0,
            durationMinutes: entry.durationMinutes ?? 1,
          })),
          colors: colorEntries,
        });
      }}
      className="flex flex-col gap-4"
    >
      <table className="w-full border-separate border-spacing-y-2 font-sans text-sm">
        <caption className="sr-only">
          Precio y duración por largo de cabello
        </caption>
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.14em] text-secondary/70">
            <th scope="col" className="font-normal">
              Largo
            </th>
            <th scope="col" className="px-2 font-normal">
              Precio (pesos)
            </th>
            <th scope="col" className="font-normal">
              Minutos
            </th>
          </tr>
        </thead>
        <tbody>
          {HAIR_LENGTHS.map((length) => (
            <tr key={length}>
              <th
                scope="row"
                className="pr-2 text-left font-medium text-secondary"
              >
                {HAIR_LENGTH_LABELS[length]}
              </th>
              <td className="px-2">
                <input
                  aria-label={`Precio para cabello ${HAIR_LENGTH_LABELS[length].toLowerCase()}`}
                  inputMode="numeric"
                  value={lengths[length].price}
                  onChange={(event) =>
                    setLengths({
                      ...lengths,
                      [length]: {
                        ...lengths[length],
                        price: formatPesosInput(event.target.value),
                      },
                    })
                  }
                  className={CELL_INPUT}
                />
              </td>
              <td>
                <input
                  aria-label={`Minutos para cabello ${HAIR_LENGTH_LABELS[length].toLowerCase()}`}
                  inputMode="numeric"
                  value={lengths[length].minutes}
                  onChange={(event) =>
                    setLengths({
                      ...lengths,
                      [length]: {
                        ...lengths[length],
                        minutes: event.target.value,
                      },
                    })
                  }
                  className={CELL_INPUT}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full border-separate border-spacing-y-2 font-sans text-sm">
        <caption className="sr-only">Recargo por color de cabello</caption>
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.14em] text-secondary/70">
            <th scope="col" className="font-normal">
              Color
            </th>
            <th scope="col" className="px-2 font-normal">
              Recargo (pesos)
            </th>
            <th scope="col" className="font-normal">
              Min. extra
            </th>
          </tr>
        </thead>
        <tbody>
          {HAIR_COLORS.map((color) => (
            <tr key={color}>
              <th
                scope="row"
                className="pr-2 text-left font-medium text-secondary"
              >
                {HAIR_COLOR_LABELS[color]}
              </th>
              <td className="px-2">
                <input
                  aria-label={`Recargo para cabello ${HAIR_COLOR_LABELS[color].toLowerCase()}`}
                  inputMode="numeric"
                  value={colors[color].surcharge}
                  onChange={(event) =>
                    setColors({
                      ...colors,
                      [color]: {
                        ...colors[color],
                        surcharge: formatPesosInput(event.target.value),
                      },
                    })
                  }
                  className={CELL_INPUT}
                />
              </td>
              <td>
                <input
                  aria-label={`Minutos extra para cabello ${HAIR_COLOR_LABELS[color].toLowerCase()}`}
                  inputMode="numeric"
                  value={colors[color].minutes}
                  onChange={(event) =>
                    setColors({
                      ...colors,
                      [color]: {
                        ...colors[color],
                        minutes: event.target.value,
                      },
                    })
                  }
                  className={CELL_INPUT}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-xs text-secondary/70">
          {isComplete
            ? "Reemplaza el precio base: largo más recargo del color. Sin perfil capilar vigente se cobra el caso más alto."
            : "Completa precio y minutos para los tres largos."}
        </p>
        <button
          type="submit"
          disabled={!isComplete || isSaving}
          className="h-10 cursor-pointer rounded-full bg-secondary px-5 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSaving ? "Guardando…" : "Guardar precios por cabello"}
        </button>
      </div>
    </form>
  );
}
