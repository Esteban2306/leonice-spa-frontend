"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";

import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";

interface InlineEditFieldProps {
  id: string;
  label: string;
  value: string;
  displayValue?: string;
  type?: "text" | "date";
  validate: (value: string) => boolean;
  onSave: (value: string) => Promise<boolean>;
}

export function InlineEditField({
  id,
  label,
  value,
  displayValue,
  type = "text",
  validate,
  onSave,
}: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const isValid = validate(draft);

  const save = async () => {
    if (!isValid || draft === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    const ok = await onSave(draft);
    setIsSaving(false);
    if (ok) setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-xs text-secondary/70">
        {label}
      </label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type={type}
            autoFocus
            value={draft}
            aria-invalid={!isValid}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") void save();
              if (event.key === "Escape") {
                setDraft(value);
                setIsEditing(false);
              }
            }}
            className={`${INPUT_CLASS} ${isValid ? "" : "border-red-400"}`}
          />
          <button type="button" aria-label="Guardar" disabled={!isValid || isSaving} onClick={() => void save()} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-secondary text-primary disabled:opacity-50">
            <Check className="size-4" />
          </button>
          <button type="button" aria-label="Descartar" disabled={isSaving} onClick={() => { setDraft(value); setIsEditing(false); }} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5">
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setDraft(value); setIsEditing(true); }}
          className="group flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-secondary/10 bg-white px-3 text-left font-sans text-sm text-secondary transition-colors hover:border-tertiary/50"
        >
          {displayValue ?? value}
          <Pencil className="size-3.5 text-secondary/40 group-hover:text-secondary" />
        </button>
      )}
    </div>
  );
}
