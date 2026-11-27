import { UserPlus } from "lucide-react";

import type { ClientListItem } from "@/src/features/admin/types/clients.types";

import type { WizardDraft } from "../../lib/booking-wizard";
import type { BookingClient } from "../../types/calendar.types";
import {
  ErrorBox,
  OptionButton,
  SECONDARY_BUTTON,
  WIZARD_INPUT,
  WizardField,
} from "./wizard-parts";

export interface ClientSearch {
  query: string;
  results: readonly ClientListItem[];
  isSearching: boolean;
  isError: boolean;
  isLongEnough: boolean;
  onQueryChange: (query: string) => void;
  onRetry: () => void;
}

interface ClientStepProps {
  draft: WizardDraft;
  search: ClientSearch;
  onPick: (client: BookingClient) => void;
  onClear: () => void;
  onStartNew: () => void;
  onField: (field: "phone" | "name" | "birthDate", value: string) => void;
}

export function ClientStep({
  draft,
  search,
  onPick,
  onClear,
  onStartNew,
  onField,
}: ClientStepProps) {
  const birthDate = (
    <WizardField id="wizard-birth" label="Fecha de nacimiento">
      <input
        id="wizard-birth"
        type="date"
        value={draft.birthDate}
        onChange={(event) => onField("birthDate", event.target.value)}
        className={WIZARD_INPUT}
      />
    </WizardField>
  );

  if (draft.picked) {
    return (
      <>
        <div className="rounded-2xl border border-secondary bg-white p-4">
          <p className="font-sans text-lg font-bold text-secondary">
            {draft.picked.name}
          </p>
          <p className="font-sans text-base text-secondary/80">
            {draft.picked.phone}
          </p>
        </div>
        {draft.picked.missingBirthDate && (
          <>
            <p className="font-sans text-base text-secondary/80">
              No tenemos su fecha de nacimiento. Escríbela para poder agendar.
            </p>
            {birthDate}
          </>
        )}
        <button type="button" onClick={onClear} className={SECONDARY_BUTTON}>
          Es otra persona
        </button>
      </>
    );
  }

  if (draft.isNewClient) {
    return (
      <>
        <WizardField id="wizard-phone" label="Celular">
          <input
            id="wizard-phone"
            type="tel"
            autoComplete="off"
            value={draft.phone}
            onChange={(event) => onField("phone", event.target.value)}
            placeholder="10 números"
            className={WIZARD_INPUT}
          />
        </WizardField>
        <WizardField id="wizard-name" label="Nombre completo">
          <input
            id="wizard-name"
            autoComplete="off"
            maxLength={100}
            value={draft.name}
            onChange={(event) => onField("name", event.target.value)}
            className={WIZARD_INPUT}
          />
        </WizardField>
        {birthDate}
        <button type="button" onClick={onClear} className={SECONDARY_BUTTON}>
          Buscar en los clientes que ya existen
        </button>
      </>
    );
  }

  return (
    <>
      <WizardField id="wizard-search" label="Escribe su nombre o celular">
        <input
          id="wizard-search"
          type="search"
          autoComplete="off"
          value={search.query}
          onChange={(event) => search.onQueryChange(event.target.value)}
          className={WIZARD_INPUT}
        />
      </WizardField>

      {search.isLongEnough && (
        <div className="flex flex-col gap-2" aria-live="polite">
          {search.isError ? (
            <ErrorBox
              message="No pudimos buscar. Tus datos siguen aquí."
              actionLabel="Buscar otra vez"
              onAction={search.onRetry}
            />
          ) : search.isSearching ? (
            <p className="font-sans text-base text-secondary/80">Buscando…</p>
          ) : search.results.length === 0 ? (
            <p className="font-sans text-base text-secondary/80">
              No encontramos a nadie con ese dato.
            </p>
          ) : (
            search.results.map((client) => (
              <OptionButton
                key={client.id}
                title={client.name}
                detail={client.phone}
                onClick={() =>
                  onPick({
                    id: client.id,
                    name: client.name,
                    phone: client.phone,
                    missingBirthDate: client.missingBirthDate ?? false,
                  })
                }
              />
            ))
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onStartNew}
        className={`${SECONDARY_BUTTON} inline-flex items-center justify-center gap-2`}
      >
        <UserPlus className="size-5" aria-hidden="true" />
        Es un cliente nuevo
      </button>
    </>
  );
}
