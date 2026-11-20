import { ShieldCheck } from "lucide-react";

import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";

import { CardShell } from "./card-shell";

interface DepositExemptCardProps {
  depositExempt: boolean;
  isSaving: boolean;
  onChange: (depositExempt: boolean) => void;
}

export function DepositExemptCard({
  depositExempt,
  isSaving,
  onChange,
}: DepositExemptCardProps) {
  return (
    <CardShell
      title="Anticipo"
      icon={<ShieldCheck className="size-5" strokeWidth={1.6} />}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-sans text-sm font-medium text-secondary">
            Clienta de confianza
          </span>
          <p className="font-sans text-sm text-secondary/70">
            {depositExempt
              ? "No paga anticipo: sus citas desde el panel o desde su WhatsApp quedan confirmadas de una vez."
              : "Paga anticipo como todas. Actívalo para que agende sin anticipo."}
          </p>
        </div>
        <CatalogSwitch
          checked={depositExempt}
          label="Clienta de confianza, sin anticipo"
          disabled={isSaving}
          onChange={onChange}
        />
      </div>
    </CardShell>
  );
}
