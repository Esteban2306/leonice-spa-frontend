import { useEffect, useRef } from "react";
import { CircleCheck } from "lucide-react";

import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./wizard-parts";

interface SuccessStepProps {
  summary: string;
  onSeeAgenda: () => void;
  onAnother: () => void;
}

export function SuccessStep({
  summary,
  onSeeAgenda,
  onAnother,
}: SuccessStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <main className="mx-auto flex min-h-[70dvh] w-full max-w-xl flex-col items-center justify-center gap-5 px-4 py-10 text-center">
      <CircleCheck className="size-16 text-secondary" aria-hidden="true" />
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-balance font-heading text-3xl text-secondary outline-none"
      >
        La cita quedó creada
      </h1>
      <p className="font-sans text-base text-secondary">{summary}</p>
      <p className="font-sans text-base text-secondary/80">
        Está esperando el depósito del cliente.
      </p>
      <div className="flex w-full flex-col gap-2">
        <button type="button" onClick={onSeeAgenda} className={PRIMARY_BUTTON}>
          Ver en la agenda
        </button>
        <button type="button" onClick={onAnother} className={SECONDARY_BUTTON}>
          Agendar otra cita
        </button>
      </div>
    </main>
  );
}
