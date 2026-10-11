"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Gauge, QrCode, ShieldCheck, Smartphone, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  ChoicePills,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import {
  useConduitContacts,
  useConduitOverview,
} from "@/src/features/admin/hooks/use-conduit";
import { useConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import type {
  CampaignPolicy,
  WarmupLevel,
} from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import {
  DANGER_LINK,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import { QrLinkDialog } from "../connection/qr-link-dialog";
import {
  connectionCopy,
  formatDateTime,
  formatWhatsappPhone,
  riskCopy,
} from "../lib/whatsapp-format";

const WARMUP: ReadonlyArray<{
  value: WarmupLevel;
  label: string;
  help: string;
}> = [
  {
    value: "FRESH",
    label: "Número nuevo",
    help: "Muy pocos envíos automáticos por día.",
  },
  {
    value: "NORMAL",
    label: "Uso habitual",
    help: "Volumen normal de avisos y recordatorios.",
  },
  {
    value: "TRUSTED",
    label: "Con historial",
    help: "Número con historial largo y sin reportes.",
  },
];
const WARMUP_ORDER: WarmupLevel[] = ["FRESH", "NORMAL", "TRUSTED"];

function PolicyCard({
  policy,
  days,
  busy,
  onSave,
}: {
  policy: CampaignPolicy;
  days: number;
  busy: boolean;
  onSave: (policy: CampaignPolicy, days: number) => Promise<boolean>;
}) {
  const [draftPolicy, setDraftPolicy] = useState(policy);
  const [draftDays, setDraftDays] = useState(String(days));
  const [confirmAny, setConfirmAny] = useState(false);
  const parsedDays = Number(draftDays);
  const validDays =
    Number.isInteger(parsedDays) && parsedDays >= 1 && parsedDays <= 730;
  const dirty =
    draftPolicy !== policy ||
    (draftPolicy === "INBOUND_ONLY" && parsedDays !== days);

  const save = () => {
    if (draftPolicy === "ANY" && policy !== "ANY") setConfirmAny(true);
    else void onSave(draftPolicy, validDays ? parsedDays : days);
  };

  return (
    <SectionCard
      title="Política anti-bloqueo"
      icon={<ShieldCheck className="size-5" strokeWidth={1.7} />}
      description="Es la principal protección del número frente a bloqueos de WhatsApp."
    >
      <ChoicePills<CampaignPolicy>
        ariaLabel="Política de envíos automáticos"
        value={draftPolicy}
        onChange={setDraftPolicy}
        options={[
          {
            value: "INBOUND_ONLY",
            label: "Solo a quien escribió (recomendada)",
          },
          { value: "ANY", label: "A cualquier número" },
        ]}
      />
      {draftPolicy === "INBOUND_ONLY" ? (
        <label className="flex flex-wrap items-center gap-2 font-sans text-sm text-secondary">
          Los mensajes automáticos solo se envían a quien le ha escrito al spa
          en los últimos
          <input
            inputMode="numeric"
            value={draftDays}
            aria-label="Días de la ventana"
            aria-invalid={!validDays}
            onChange={(event) =>
              setDraftDays(event.target.value.replace(/\D/g, ""))
            }
            className={`${INPUT_CLASS} h-9 w-20 text-center tabular-nums`}
          />
          días.
        </label>
      ) : (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-900">
          Enviar a números que no le han escrito al spa aumenta el riesgo de que
          WhatsApp bloquee el número.
        </p>
      )}
      <p className="font-sans text-xs text-secondary/70">
        Cada persona del equipo que deba recibir avisos internos debe escribirle
        una vez al WhatsApp del spa.
      </p>
      <button
        type="button"
        className={`${PRIMARY_BUTTON} w-fit`}
        disabled={
          !dirty || busy || (draftPolicy === "INBOUND_ONLY" && !validDays)
        }
        onClick={save}
      >
        Guardar política
      </button>
      <ActionDialog
        open={confirmAny}
        onOpenChange={setConfirmAny}
        tone="danger"
        title="¿Enviar a cualquier número?"
        description="Esto aumenta el riesgo de que WhatsApp bloquee el número del spa. ¿Continuar?"
        submitLabel="Sí, cambiar la política"
        submittingLabel="Guardando…"
        onSubmit={() => onSave("ANY", days)}
      />
    </SectionCard>
  );
}

function ContactsCard({ windowDays }: { windowDays: number }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const digits = search.replace(/\D/g, "");
  const debounced = useDebouncedValue(digits, 350, digits);
  const contacts = useConduitContacts({
    search: debounced || undefined,
    page,
    limit: 20,
  });
  const total = contacts.data?.meta.total ?? 0;
  const nowMs = useMinuteClock();
  const cutoff = nowMs - windowDays * 24 * 60 * 60 * 1000;

  return (
    <SectionCard
      title="Contactos"
      icon={<Users className="size-5" strokeWidth={1.7} />}
      description="Quién le ha escrito al spa y puede recibir mensajes automáticos."
    >
      <input
        type="search"
        inputMode="tel"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
        placeholder="Buscar por número"
        aria-label="Buscar contacto por número"
        className={`${INPUT_CLASS} max-w-xs`}
      />
      {contacts.isError ? (
        <ErrorPanel
          error={contacts.error}
          onRetry={() => void contacts.refetch()}
          compact
        />
      ) : contacts.isLoading ? (
        <SkeletonRows rows={3} height="h-10" />
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[34rem] font-sans text-sm">
            <thead>
              <tr className="border-b border-tertiary/25 text-left text-xs uppercase tracking-[0.12em] text-secondary/70">
                <th scope="col" className="py-2 pr-3 font-normal">
                  Número
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Último mensaje de la clienta
                </th>
                <th scope="col" className="py-2 pr-3 font-normal">
                  Puede recibir avisos
                </th>
                <th scope="col" className="py-2 font-normal">
                  Tiene WhatsApp
                </th>
              </tr>
            </thead>
            <tbody>
              {(contacts.data?.data ?? []).map((contact) => {
                const eligible = contact.lastInboundAt
                  ? new Date(contact.lastInboundAt).getTime() >= cutoff
                  : false;
                return (
                  <tr
                    key={contact.address}
                    className="border-b border-tertiary/15 last:border-b-0"
                  >
                    <td className="py-2.5 pr-3 text-secondary tabular-nums">
                      {formatWhatsappPhone(contact.address)}
                    </td>
                    <td className="py-2.5 pr-3 text-secondary/80">
                      {formatDateTime(contact.lastInboundAt)}
                    </td>
                    <td className="py-2.5 pr-3">
                      <StatusPill tone={eligible ? "green" : "gray"}>
                        {eligible ? "Sí" : "No"}
                      </StatusPill>
                    </td>
                    <td className="py-2.5 text-secondary/80">
                      {contact.onWhatsApp === null
                        ? "Sin verificar"
                        : contact.onWhatsApp
                          ? "Sí"
                          : "No"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {total === 0 && (
            <p className="py-6 text-center font-sans text-sm text-secondary/70">
              Sin contactos.
            </p>
          )}
        </div>
      )}
      {total > 20 && (
        <div className="flex items-center justify-between font-sans text-sm text-secondary/75">
          <span className="tabular-nums">
            Página {page} de {Math.ceil(total / 20)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className={`${SECONDARY_BUTTON} h-9`}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </button>
            <button
              type="button"
              className={`${SECONDARY_BUTTON} h-9`}
              disabled={page * 20 >= total}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

export function ConnectionSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const overview = useConduitOverview();
  const actions = useConduitActions();
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [pendingWarmup, setPendingWarmup] = useState<WarmupLevel | null>(null);
  const qrOpen = searchParams.get("vincular") === "1";

  const setQrOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) params.set("vincular", "1");
    else params.delete("vincular");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  if (overview.isLoading) return <SkeletonRows rows={3} height="h-48" />;
  if (overview.isError || !overview.data)
    return (
      <ErrorPanel
        error={overview.error}
        onRetry={() => void overview.refetch()}
      />
    );

  const { reachable, connection, connectionHealth } = overview.data;
  const copy = connectionCopy(
    connection?.status,
    reachable,
    connection?.phoneNumber,
  );
  const banned = connection?.status === "BANNED";
  const risk = riskCopy(connectionHealth?.rateLimiter.riskLevel ?? 1);

  const startLink = async () => {
    const ok = await (connection?.status === "ERROR"
      ? actions.reconnect()
      : actions.connect());
    if (ok) setQrOpen(true);
  };

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      <SectionCard
        className="xl:col-span-2"
        title={
          connection?.name ? `Número: ${connection.name}` : "Número de WhatsApp"
        }
        icon={<Smartphone className="size-5" strokeWidth={1.7} />}
        aside={
          <StatusPill tone={copy.tone} size="md">
            {copy.label}
          </StatusPill>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex flex-col gap-2">
            <p className="font-sans text-base text-secondary">
              {copy.description}
            </p>
            {connection?.phoneNumber && (
              <p className="font-sans text-sm text-secondary/75 tabular-nums">
                Número vinculado: {formatWhatsappPhone(connection.phoneNumber)}
              </p>
            )}
            <p className="font-sans text-xs text-secondary/70">
              {connection?.connectedAt &&
                `Conectado: ${formatDateTime(connection.connectedAt)}`}
              {connection?.disconnectedAt &&
                ` · Última desconexión: ${formatDateTime(connection.disconnectedAt)}`}
            </p>
            {banned && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-900">
                No intentes reconectar el número: escribe al soporte técnico con
                el nombre de la conexión y la fecha del bloqueo.
              </p>
            )}
          </div>
          {!banned && reachable && (
            <div className="flex flex-wrap gap-2">
              {connection?.status !== "CONNECTED" && (
                <button
                  type="button"
                  className={PRIMARY_BUTTON}
                  disabled={actions.busy.has("connection")}
                  onClick={() => void startLink()}
                >
                  <QrCode className="size-4" />
                  {connection?.status === "CONNECTING"
                    ? "Ver código QR"
                    : connection?.status === "ERROR"
                      ? "Volver a vincular"
                      : "Conectar"}
                </button>
              )}
              {connection?.status === "CONNECTED" && (
                <button
                  type="button"
                  className={SECONDARY_BUTTON}
                  disabled={actions.busy.has("connection")}
                  onClick={() => void actions.reconnect()}
                >
                  Reconectar
                </button>
              )}
              {connection?.status !== "DISCONNECTED" && (
                <button
                  type="button"
                  className={DANGER_LINK}
                  onClick={() => setConfirmDisconnect(true)}
                >
                  Desconectar
                </button>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {connection && !banned && (
        <SectionCard
          title="Nivel de calentamiento"
          icon={<Gauge className="size-5" strokeWidth={1.7} />}
          description="Controla cuántos envíos automáticos hace el número por día."
          aside={<StatusPill tone={risk.tone}>Riesgo: {risk.label}</StatusPill>}
        >
          <div
            role="radiogroup"
            aria-label="Nivel de calentamiento"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          >
            {WARMUP.map((option) => {
              const isCurrent = connection.warmupLevel === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isCurrent}
                  disabled={actions.busy.has("warmup")}
                  onClick={() => {
                    if (isCurrent) return;
                    const raising =
                      WARMUP_ORDER.indexOf(option.value) >
                      WARMUP_ORDER.indexOf(connection.warmupLevel);
                    if (raising) setPendingWarmup(option.value);
                    else void actions.setWarmupLevel(option.value);
                  }}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-[1.25rem] border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary disabled:opacity-60",
                    isCurrent
                      ? "border-secondary bg-white"
                      : "border-secondary/15 bg-white/60 hover:bg-quaternary/20",
                  )}
                >
                  <span className="font-sans text-sm font-semibold text-secondary">
                    {option.label}
                  </span>
                  <span className="font-sans text-xs text-secondary/70">
                    {option.help}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionCard>
      )}

      {connection && (
        <PolicyCard
          key={`${connection.campaignPolicy}-${connection.inboundLookbackDays}`}
          policy={connection.campaignPolicy}
          days={connection.inboundLookbackDays}
          busy={actions.busy.has("policy")}
          onSave={actions.setCampaignPolicy}
        />
      )}

      <div className="xl:col-span-2">
        <ContactsCard windowDays={connection?.inboundLookbackDays ?? 180} />
      </div>

      <QrLinkDialog
        open={qrOpen}
        actions={actions}
        onClose={() => setQrOpen(false)}
      />
      <ActionDialog
        open={confirmDisconnect}
        onOpenChange={setConfirmDisconnect}
        tone="danger"
        title="¿Desconectar WhatsApp?"
        description="El asistente y los recordatorios dejarán de funcionar hasta que vuelvas a vincular el número."
        submitLabel="Desconectar"
        submittingLabel="Desconectando…"
        onSubmit={actions.disconnect}
      />
      <ActionDialog
        open={pendingWarmup !== null}
        onOpenChange={(open) => !open && setPendingWarmup(null)}
        title="¿Subir el nivel de calentamiento?"
        description="Con más envíos por día aumenta el riesgo de bloqueo si el número aún no tiene historial. Sube un nivel a la vez."
        submitLabel="Subir nivel"
        submittingLabel="Guardando…"
        onSubmit={() =>
          pendingWarmup
            ? actions.setWarmupLevel(pendingWarmup)
            : Promise.resolve(false)
        }
      />
    </div>
  );
}
