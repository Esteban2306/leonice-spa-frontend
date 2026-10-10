"use client";

import { useState, type FormEvent } from "react";
import { Check, Circle, Eye, EyeOff, KeyRound } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";

import { evaluatePassword, type PasswordDraft } from "../lib/password-rules";

interface PasswordCardProps {
  email: string | null;
  isSaving: boolean;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
}

const EMPTY: PasswordDraft = { current: "", next: "", confirmation: "" };

function PasswordInput({
  id,
  label,
  value,
  autoComplete,
  isVisible,
  invalid,
  describedBy,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  isVisible: boolean;
  invalid?: boolean;
  describedBy?: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <input
        id={id}
        type={isVisible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
      />
    </Field>
  );
}

export function PasswordCard({
  email,
  isSaving,
  onChangePassword,
}: PasswordCardProps) {
  const [draft, setDraft] = useState<PasswordDraft>(EMPTY);
  const [isVisible, setIsVisible] = useState(false);
  const result = evaluatePassword(draft);
  const showMismatch = draft.confirmation.length > 0 && !result.matches;
  const showSame =
    draft.next.length > 0 && draft.current.length > 0 && !result.isDifferent;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!result.canSubmit || isSaving) return;
    const ok = await onChangePassword(draft.current, draft.next);
    if (ok) setDraft(EMPTY);
  };

  return (
    <section
      aria-labelledby="password-title"
      className="flex flex-col gap-5 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-5 sm:p-6"
    >
      <header className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-secondary text-quaternary">
          <KeyRound className="size-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0">
          <h2
            id="password-title"
            className="font-heading text-2xl leading-tight text-secondary"
          >
            Contraseña
          </h2>
          {email && (
            <p className="truncate font-sans text-sm text-secondary/70">
              {email}
            </p>
          )}
        </div>
      </header>

      <form
        onSubmit={(event) => void submit(event)}
        className="flex flex-col gap-4"
      >
        <PasswordInput
          id="password-current"
          label="Contraseña actual"
          autoComplete="current-password"
          value={draft.current}
          isVisible={isVisible}
          onChange={(current) => setDraft({ ...draft, current })}
        />
        <PasswordInput
          id="password-next"
          label="Nueva contraseña"
          autoComplete="new-password"
          value={draft.next}
          isVisible={isVisible}
          invalid={showSame}
          describedBy="password-rules"
          onChange={(next) => setDraft({ ...draft, next })}
        />
        <PasswordInput
          id="password-confirmation"
          label="Repite la nueva contraseña"
          autoComplete="new-password"
          value={draft.confirmation}
          isVisible={isVisible}
          invalid={showMismatch}
          onChange={(confirmation) => setDraft({ ...draft, confirmation })}
        />

        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          aria-pressed={isVisible}
          className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-full font-sans text-sm text-secondary/75 underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
          {isVisible ? "Ocultar contraseñas" : "Mostrar contraseñas"}
        </button>

        <ul
          id="password-rules"
          aria-label="Requisitos de la nueva contraseña"
          className="grid grid-cols-1 gap-1.5 sm:grid-cols-2"
        >
          {result.rules.map((rule) => (
            <li
              key={rule.key}
              className={cn(
                "flex items-center gap-2 font-sans text-sm",
                rule.passed ? "text-green-800" : "text-secondary/70",
              )}
            >
              {rule.passed ? (
                <Check className="size-4 shrink-0" strokeWidth={2.2} />
              ) : (
                <Circle className="size-3.5 shrink-0" strokeWidth={1.8} />
              )}
              {rule.label}
              <span className="sr-only">
                {rule.passed ? "cumplido" : "pendiente"}
              </span>
            </li>
          ))}
        </ul>

        {(showMismatch || showSame) && (
          <p role="alert" className="font-sans text-sm text-red-700">
            {showSame
              ? "La nueva contraseña debe ser distinta de la actual."
              : "Las contraseñas nuevas no coinciden."}
          </p>
        )}

        <div className="flex flex-col gap-3 border-t border-tertiary/25 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-secondary/70 sm:max-w-xs">
            Al guardar cerraremos tu sesión para que entres con la nueva
            contraseña.
          </p>
          <button
            type="submit"
            disabled={!result.canSubmit || isSaving}
            className="h-11 shrink-0 cursor-pointer rounded-full bg-secondary px-6 font-sans text-sm font-medium whitespace-nowrap text-primary transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </section>
  );
}
