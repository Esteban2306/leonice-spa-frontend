import type { ReactNode } from "react";
import { Check, ChevronRight } from "lucide-react";

export const PRIMARY_BUTTON =
  "min-h-13 w-full cursor-pointer rounded-full bg-secondary px-5 font-sans text-base font-bold text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55";

export const SECONDARY_BUTTON =
  "min-h-12 w-full cursor-pointer rounded-full border border-secondary/30 bg-white px-5 font-sans text-base text-secondary transition-colors hover:bg-quaternary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

export const WIZARD_INPUT =
  "min-h-13 w-full rounded-xl border border-secondary/30 bg-white px-4 font-sans text-base text-secondary outline-none placeholder:text-secondary/65 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/50";

interface OptionButtonProps {
  title: string;
  detail?: string;
  selected?: boolean;
  onClick: () => void;
}

export function OptionButton({
  title,
  detail,
  selected,
  onClick,
}: OptionButtonProps) {
  const Icon = selected ? Check : ChevronRight;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary ${
        selected
          ? "border-secondary bg-secondary text-primary"
          : "border-secondary/20 bg-white text-secondary hover:bg-quaternary/25"
      }`}
    >
      <span className="min-w-0">
        <span className="block font-sans text-base font-bold">{title}</span>
        {detail && (
          <span className="block font-sans text-sm opacity-80">{detail}</span>
        )}
      </span>
      <Icon className="size-5 shrink-0" aria-hidden="true" />
    </button>
  );
}

interface WizardFieldProps {
  id: string;
  label: string;
  children: ReactNode;
}

export function WizardField({ id, label, children }: WizardFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-sans text-base text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

interface ErrorBoxProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function ErrorBox({ message, actionLabel, onAction }: ErrorBoxProps) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
    >
      <p className="font-sans text-base text-red-800">{message}</p>
      <button type="button" onClick={onAction} className={SECONDARY_BUTTON}>
        {actionLabel}
      </button>
    </div>
  );
}

/** Pie del paso: dice qué falta y deja el botón principal al alcance del pulgar. */
export function ContinueFooter({
  missing,
  label,
  onContinue,
}: {
  missing: string | null;
  label: string;
  onContinue: () => void;
}) {
  return (
    <>
      {missing && (
        <p
          id="falta"
          aria-live="polite"
          className="text-center font-sans text-sm text-secondary/80"
        >
          {missing}
        </p>
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={missing !== null}
        aria-describedby={missing ? "falta" : undefined}
        className={PRIMARY_BUTTON}
      >
        {label}
      </button>
    </>
  );
}
