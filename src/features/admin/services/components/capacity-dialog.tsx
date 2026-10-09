"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";
import type { CapacityPool } from "@/src/features/admin/types/capacity-pools.types";
import type { AdminCategory } from "@/src/features/admin/types/categories.types";

import { CatalogSwitch } from "./catalog-switch";

interface CapacityDialogProps {
  category: AdminCategory | null;
  pools: readonly CapacityPool[];
  onClose: () => void;
  onCreate: (name: string, maxConcurrent: number) => Promise<boolean>;
  onUpdate: (
    poolId: string,
    name: string,
    maxConcurrent: number,
  ) => Promise<boolean>;
  onToggle: (poolId: string, isActive: boolean) => Promise<boolean>;
}

const SMALL_BUTTON =
  "h-9 cursor-pointer rounded-full bg-secondary px-4 font-sans text-xs font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40";

function toCapacity(raw: string): number {
  const value = Number(raw.replace(/\D/g, ""));
  return Number.isInteger(value) ? value : 0;
}

function PoolRow({
  pool,
  onUpdate,
  onToggle,
}: {
  pool: CapacityPool;
  onUpdate: CapacityDialogProps["onUpdate"];
  onToggle: CapacityDialogProps["onToggle"];
}) {
  const [name, setName] = useState(pool.name);
  const [max, setMax] = useState(String(pool.maxConcurrent));
  const [isSaving, setIsSaving] = useState(false);

  const capacity = toCapacity(max);
  const isDirty = name.trim() !== pool.name || capacity !== pool.maxConcurrent;
  const isValid = name.trim().length >= 2 && capacity >= 1;

  const save = async () => {
    setIsSaving(true);
    await onUpdate(pool.id, name.trim(), capacity);
    setIsSaving(false);
  };

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-2xl border border-secondary/10 bg-white/70 p-3">
      <input
        aria-label="Nombre de la capacidad"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={`${INPUT_CLASS} h-9 min-w-0 flex-1 basis-40`}
      />
      <input
        aria-label={`Citas simultáneas en ${pool.name}`}
        inputMode="numeric"
        value={max}
        onChange={(event) => setMax(event.target.value)}
        className={`${INPUT_CLASS} h-9 w-16 text-center tabular-nums`}
      />
      <CatalogSwitch
        checked={pool.isActive}
        label={
          pool.isActive ? `Desactivar ${pool.name}` : `Activar ${pool.name}`
        }
        onChange={(next) => void onToggle(pool.id, next)}
      />
      {isDirty && (
        <button
          type="button"
          disabled={!isValid || isSaving}
          onClick={() => void save()}
          className={SMALL_BUTTON}
        >
          {isSaving ? "Guardando…" : "Guardar"}
        </button>
      )}
    </li>
  );
}

export function CapacityDialog({
  category,
  pools,
  onClose,
  onCreate,
  onUpdate,
  onToggle,
}: CapacityDialogProps) {
  const [newName, setNewName] = useState("");
  const [newMax, setNewMax] = useState("1");
  const [isCreating, setIsCreating] = useState(false);

  const canCreate = newName.trim().length >= 2 && toCapacity(newMax) >= 1;

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate || isCreating) return;
    setIsCreating(true);
    const created = await onCreate(newName.trim(), toCapacity(newMax));
    setIsCreating(false);
    if (created) {
      setNewName("");
      setNewMax("1");
    }
  };

  return (
    <Dialog
      open={category !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="gap-0 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-0 sm:max-w-lg">
        <div className="flex flex-col gap-2 p-6 pb-4">
          <DialogTitle className="font-heading text-2xl text-secondary">
            Capacidad de {category?.name}
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-secondary/65">
            Cada capacidad define cuántas citas de esta categoría pueden ocurrir
            a la vez. El calendario suma las activas.
          </DialogDescription>
        </div>

        <ul className="flex max-h-[45vh] flex-col gap-2 overflow-y-auto px-6">
          {pools.map((pool) => (
            <PoolRow
              key={`${pool.id}-${pool.name}-${pool.maxConcurrent}`}
              pool={pool}
              onUpdate={onUpdate}
              onToggle={onToggle}
            />
          ))}
          {pools.length === 0 && (
            <li className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-3 font-sans text-sm text-amber-900">
              Esta categoría no tiene capacidad: sus servicios no se pueden
              reservar.
            </li>
          )}
        </ul>

        <form
          onSubmit={(event) => void handleCreate(event)}
          className="mt-4 flex flex-wrap items-center gap-2 border-t border-tertiary/25 p-4 px-6"
        >
          <input
            aria-label="Nombre de la nueva capacidad"
            placeholder="Ej. Sillas principales"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            className={`${INPUT_CLASS} h-10 min-w-0 flex-1 basis-40`}
          />
          <input
            aria-label="Citas simultáneas de la nueva capacidad"
            inputMode="numeric"
            value={newMax}
            onChange={(event) => setNewMax(event.target.value)}
            className={`${INPUT_CLASS} h-10 w-16 text-center tabular-nums`}
          />
          <button
            type="submit"
            disabled={!canCreate || isCreating}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-secondary px-4 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={1.8} />
            {isCreating ? "Agregando…" : "Agregar"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
