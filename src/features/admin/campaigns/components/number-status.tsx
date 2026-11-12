import Link from "@/src/features/admin/components/admin-link";

import { useConduitOverview } from "@/src/features/admin/hooks/use-conduit";
import type {
  CampaignPolicy,
  WarmupLevel,
} from "@/src/features/admin/types/conduit.types";

const WARMUP_LABELS: Record<WarmupLevel, string> = {
  FRESH: "Número nuevo",
  NORMAL: "Número establecido",
  TRUSTED: "Número de confianza",
};

const POLICY_LABELS: Record<CampaignPolicy, string> = {
  INBOUND_ONLY: "solo a quienes ya escribieron",
  ANY: "a cualquier contacto",
};

export function NumberStatus() {
  const overview = useConduitOverview();
  const connection = overview.data?.connection;
  if (!connection) return null;

  const open = connection.campaignPolicy === "ANY";
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 font-sans text-sm ${
        open
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : "border-tertiary/30 bg-[#FCF6EB] text-secondary"
      }`}
    >
      <p>
        <strong className="font-semibold">
          {WARMUP_LABELS[connection.warmupLevel]}
        </strong>{" "}
        · WhatsApp envía campañas {POLICY_LABELS[connection.campaignPolicy]}
        {connection.campaignPolicy === "INBOUND_ONLY" &&
          ` (últimos ${connection.inboundLookbackDays} días)`}
        .
        {open &&
          " Recomendamos limitarlo a quienes ya escribieron para cuidar el número."}
      </p>
      <Link
        href="/admin/whatsapp"
        className="underline underline-offset-4 hover:text-secondary/70"
      >
        Ajustar en WhatsApp
      </Link>
    </div>
  );
}
