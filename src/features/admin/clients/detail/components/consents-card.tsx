import { FileCheck2 } from "lucide-react";

import type { ClientDetail, ConsentType } from "@/src/features/admin/types/clients.types";

import { CardShell } from "./card-shell";

const CONSENT_LABELS: Record<ConsentType, string> = {
  DATOS_SALUD: "Datos sensibles de salud",
  MARKETING: "Comunicaciones de marketing",
  TERMINOS_SERVICIO: "Términos del servicio",
  AUTORIZACION_MENOR: "Autorización de menor de edad",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Bogota" });

export function ConsentsCard({ consents }: { consents: ClientDetail["consents"] }) {
  return (
    <CardShell title="Consentimientos">
      {consents.length === 0 ? (
        <p className="rounded-xl border border-dashed border-tertiary/40 p-3 font-sans text-xs text-secondary/70">
          No hay consentimientos registrados.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {consents.map((consent) => (
            <li key={`${consent.type}-${consent.consentedAt}`} className="flex items-start gap-3 rounded-xl border border-secondary/10 bg-white p-3">
              <FileCheck2 className="mt-0.5 size-4 shrink-0 text-green-700" />
              <span className="font-sans text-sm text-secondary">
                {CONSENT_LABELS[consent.type]} · {consent.policyVersion}
                <span className="block text-xs text-secondary/70">
                  Firmado {DATE_FORMATTER.format(new Date(consent.consentedAt))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}
