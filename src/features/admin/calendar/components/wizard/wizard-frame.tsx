"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ArrowLeft, X } from "lucide-react";

interface WizardFrameProps {
  title: string;
  stepNumber: number;
  totalSteps: number;
  onBack: (() => void) | null;
  onExit: () => void;
  /** Mientras se crea la cita no se puede salir ni volver. */
  isBusy: boolean;
  footer?: ReactNode;
  children: ReactNode;
}

const TOP_BUTTON =
  "inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 font-sans text-base text-secondary transition-colors hover:bg-secondary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:cursor-not-allowed disabled:opacity-50";

export function WizardFrame({
  title,
  stepNumber,
  totalSteps,
  onBack,
  onExit,
  isBusy,
  footer,
  children,
}: WizardFrameProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Cada paso empieza arriba y se anuncia a quien usa lector de pantalla.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [title]);

  return (
    <main className="fixed inset-0 z-50 flex flex-col bg-primary desk:static desk:z-auto desk:h-dvh">
      <div className="border-b border-secondary/10">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-2 px-2 py-2">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isBusy}
              className={TOP_BUTTON}
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
              Atrás
            </button>
          ) : (
            <span className="w-20" />
          )}
          <p className="font-sans text-base text-secondary/80">
            Paso {stepNumber} de {totalSteps}
          </p>
          <button
            type="button"
            onClick={onExit}
            disabled={isBusy}
            className={TOP_BUTTON}
          >
            Salir
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto flex w-full max-w-xl gap-1 px-4 pb-2" aria-hidden="true">
          {Array.from({ length: totalSteps }, (_, index) => (
            <span
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index < stepNumber ? "bg-secondary" : "bg-secondary/15"
              }`}
            />
          ))}
        </div>
      </div>

      <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5 px-4 py-6">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-balance font-heading text-3xl text-secondary outline-none"
          >
            {title}
          </h1>
          {children}
        </div>
      </div>

      {footer && (
        <div className="border-t border-secondary/10 bg-primary pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 py-3">
            {footer}
          </div>
        </div>
      )}
    </main>
  );
}
