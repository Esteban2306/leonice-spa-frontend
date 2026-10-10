import type { ComponentProps } from "react";

import { PasswordCard } from "../components/password-card";
import { RecipientsCard } from "../components/recipients-card";

interface SettingsViewProps {
  recipients: ComponentProps<typeof RecipientsCard>;
  password: ComponentProps<typeof PasswordCard>;
}

export function SettingsView({ recipients, password }: SettingsViewProps) {
  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="rounded-[2rem] bg-secondary p-6 text-primary sm:p-8">
          <h1 className="font-heading text-4xl sm:text-5xl">Ajustes</h1>
          <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
            Quién del equipo recibe los avisos del spa por WhatsApp y la
            seguridad de tu cuenta.
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <RecipientsCard {...recipients} />
          <PasswordCard {...password} />
        </div>
      </div>
    </main>
  );
}
