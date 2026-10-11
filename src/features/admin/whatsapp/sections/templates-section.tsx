"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BellRing,
  Copy,
  FileText,
  Pencil,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react";

import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import { useAutomationRules } from "@/src/features/admin/hooks/use-automation-rules";
import { useCategories } from "@/src/features/admin/hooks/use-categories";
import {
  useConduitContacts,
  useConduitOverview,
  useConduitTemplates,
  useTemplateUsage,
} from "@/src/features/admin/hooks/use-conduit";
import {
  useConduitActions,
  type ConduitActions,
} from "@/src/features/admin/hooks/use-conduit-actions";
import { useNotificationRecipients } from "@/src/features/admin/hooks/use-notification-recipients";
import type { AutomationRule } from "@/src/features/admin/types/automation.types";
import type {
  ConduitTemplate,
  TemplateUsage,
} from "@/src/features/admin/types/conduit.types";

import { ErrorPanel } from "../components/error-panel";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "../components/section-card";
import { StatusPill } from "../components/status-pill";
import {
  REQUIRED_TEMPLATE_VARIABLES,
  formatWhatsappPhone,
  missingVariables,
} from "../lib/whatsapp-format";
import { TemplateEditorDialog } from "../templates/template-editor-dialog";

const PURPOSE_COPY: Record<string, string> = {
  RESERVATION_REMINDER: "Recordatorio de cita",
  REACTIVATION: "Reactivación",
  REACTIVATION_PROMO: "Reactivación con promoción",
  CLIENT_DEPOSIT_REJECTED: "Comprobante rechazado (con plazo)",
  CLIENT_DEPOSIT_REJECTED_NO_DEADLINE: "Comprobante rechazado (sin plazo)",
  CLIENT_RESCHEDULED: "Cita reagendada",
  CLIENT_CANCELLATION_CONFIRMED: "Cancelación confirmada",
  CLIENT_CANCELLATION_LINK: "Enlace para cancelar",
  ADMIN_DEPOSIT_TIMEOUT: "Depósito vencido",
  ADMIN_RESCHEDULED: "Reprogramación",
  ADMIN_CLIENT_CANCELLED: "Cancelación de la clienta",
  ADMIN_HANDOFF: "La clienta pidió una persona",
};

interface EditorState {
  open: boolean;
  template: ConduitTemplate | null;
  usage: TemplateUsage | null;
  version: number;
}

function UsageCard({
  templates,
  onCreate,
}: {
  templates: readonly ConduitTemplate[];
  onCreate: (usage: TemplateUsage) => void;
}) {
  const usage = useTemplateUsage();
  const [copied, setCopied] = useState<string | null>(null);
  if (usage.isLoading) return <SkeletonRows rows={4} height="h-12" />;
  if (usage.isError || !usage.data)
    return (
      <ErrorPanel error={usage.error} onRetry={() => void usage.refetch()} />
    );
  const byId = new Map(templates.map((t) => [t.id, t]));
  const missing = usage.data.filter((u) => !u.configured).length;

  return (
    <SectionCard
      title="Qué envía el sistema"
      icon={<BellRing className="size-5" strokeWidth={1.7} />}
      description="Cada aviso automático usa una plantilla. El sistema la enlaza sola por su nombre; la variable del servidor solo hace falta si quieres forzar otra."
      aside={
        <StatusPill tone={missing ? "red" : "green"}>
          {missing ? `${missing} sin configurar` : "Todas configuradas"}
        </StatusPill>
      }
    >
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[46rem] font-sans text-sm">
          <thead>
            <tr className="border-b border-tertiary/25 text-left text-xs uppercase tracking-[0.12em] text-secondary/70">
              <th scope="col" className="py-2 pr-3 font-normal">
                Aviso
              </th>
              <th scope="col" className="py-2 pr-3 font-normal">
                Para
              </th>
              <th scope="col" className="py-2 pr-3 font-normal">
                Variables obligatorias
              </th>
              <th scope="col" className="py-2 pr-3 font-normal">
                Estado
              </th>
              <th scope="col" className="py-2 font-normal">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {usage.data.map((item) => {
              const spec = REQUIRED_TEMPLATE_VARIABLES[item.name];
              const template = item.templateId
                ? byId.get(item.templateId)
                : undefined;
              const lacking =
                template && spec
                  ? missingVariables(template.bodyHandlebars, spec.variables)
                  : [];
              return (
                <tr
                  key={item.name}
                  className={`border-b border-tertiary/15 last:border-b-0 ${item.configured ? "" : "bg-red-50/60"}`}
                >
                  <td className="py-2.5 pr-3 align-top">
                    <p className="text-secondary">
                      {PURPOSE_COPY[item.name] ?? item.name}
                    </p>
                    <p className="font-mono text-[11px] text-secondary/60">
                      {item.source === "env" ? item.envKey : item.catalogName}
                    </p>
                    {item.source && (
                      <p className="font-sans text-[11px] text-secondary/60">
                        {item.source === "env"
                          ? "Fijada en el servidor"
                          : "Enlazada por nombre"}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 align-top text-secondary/80">
                    {spec?.audience ?? "—"}
                  </td>
                  <td className="py-2.5 pr-3 align-top">
                    <span className="font-mono text-[11px] text-secondary/80">
                      {spec?.variables.map((v) => `{{${v}}}`).join(" ") ?? "—"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 align-top">
                    {!item.configured ? (
                      <StatusPill tone="red">Sin configurar</StatusPill>
                    ) : !template ? (
                      <StatusPill tone="amber">
                        ID sin plantilla en Conduit
                      </StatusPill>
                    ) : lacking.length ? (
                      <StatusPill tone="amber">
                        Le faltan {lacking.join(", ")}
                      </StatusPill>
                    ) : (
                      <StatusPill tone="green">{template.name}</StatusPill>
                    )}
                  </td>
                  <td className="py-2.5 align-top">
                    {!item.configured && (
                      <button
                        type="button"
                        onClick={() => onCreate(item)}
                        className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-xs text-secondary underline decoration-tertiary underline-offset-4"
                      >
                        Crear plantilla
                      </button>
                    )}
                    {item.templateId && (
                      <button
                        type="button"
                        onClick={() =>
                          void navigator.clipboard
                            ?.writeText(item.templateId ?? "")
                            .then(() => setCopied(item.name))
                        }
                        className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-xs text-secondary/75 hover:bg-secondary/5"
                      >
                        <Copy className="size-3.5" />
                        {copied === item.name ? "Copiado" : "ID"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function TemplatesCard({
  templates,
  actions,
  onEdit,
  onCreate,
}: {
  templates: readonly ConduitTemplate[];
  actions: ConduitActions;
  onEdit: (template: ConduitTemplate) => void;
  onCreate: () => void;
}) {
  const [removing, setRemoving] = useState<ConduitTemplate | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  return (
    <SectionCard
      title="Plantillas"
      icon={<FileText className="size-5" strokeWidth={1.7} />}
      aside={
        <button
          type="button"
          className={`${SECONDARY_BUTTON} h-10`}
          onClick={onCreate}
        >
          <Plus className="size-4" />
          Nueva plantilla
        </button>
      }
    >
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex flex-col gap-2 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-secondary">
                  {template.name}
                </p>
                {template.description && (
                  <p className="font-sans text-xs text-secondary/70">
                    {template.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  aria-label={`Copiar ID de ${template.name}`}
                  onClick={() =>
                    void navigator.clipboard
                      ?.writeText(template.id)
                      .then(() => setCopied(template.id))
                  }
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5"
                >
                  <Copy className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Editar ${template.name}`}
                  onClick={() => onEdit(template)}
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Eliminar ${template.name}`}
                  onClick={() => setRemoving(template)}
                  className="grid size-8 cursor-pointer place-items-center rounded-full text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="line-clamp-4 rounded-xl bg-primary px-3 py-2 font-sans text-sm whitespace-pre-wrap text-secondary/85">
              {template.bodyHandlebars}
            </p>
            {copied === template.id && (
              <p className="font-sans text-[11px] text-green-800">ID copiado</p>
            )}
          </li>
        ))}
        {templates.length === 0 && (
          <li className="py-6 text-center font-sans text-sm text-secondary/70">
            Aún no hay plantillas.
          </li>
        )}
      </ul>
      <ActionDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        tone="danger"
        title={`¿Eliminar ${removing?.name ?? "la plantilla"}?`}
        description="Si el sistema la usa para un aviso, ese aviso dejará de enviarse."
        submitLabel="Eliminar"
        submittingLabel="Eliminando…"
        onSubmit={() =>
          removing
            ? actions.removeTemplate(removing.id)
            : Promise.resolve(false)
        }
      />
    </SectionCard>
  );
}

function RuleRow({
  rule,
  actions,
}: {
  rule: AutomationRule;
  actions: ConduitActions;
}) {
  const [reminder, setReminder] = useState(rule.reminderDays?.toString() ?? "");
  const [reactivation, setReactivation] = useState(
    rule.reactivationDays.toString(),
  );
  const dirty =
    reminder !== (rule.reminderDays?.toString() ?? "") ||
    reactivation !== rule.reactivationDays.toString();
  return (
    <li className="flex flex-wrap items-end gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3">
      <Field label="Recordar (días antes)" htmlFor={`r-rem-${rule.id}`}>
        <input
          id={`r-rem-${rule.id}`}
          inputMode="numeric"
          value={reminder}
          onChange={(e) => setReminder(e.target.value.replace(/\D/g, ""))}
          className={`${INPUT_CLASS} h-10 w-28 tabular-nums`}
        />
      </Field>
      <Field label="Reactivar tras (días)" htmlFor={`r-rea-${rule.id}`}>
        <input
          id={`r-rea-${rule.id}`}
          inputMode="numeric"
          value={reactivation}
          onChange={(e) => setReactivation(e.target.value.replace(/\D/g, ""))}
          className={`${INPUT_CLASS} h-10 w-28 tabular-nums`}
        />
      </Field>
      {dirty && (
        <button
          type="button"
          className={`${PRIMARY_BUTTON} h-10`}
          disabled={!reactivation || actions.busy.has(`rule:${rule.id}`)}
          onClick={() =>
            void actions.updateAutomationRule(rule.id, {
              reminderDays: reminder ? Number(reminder) : undefined,
              reactivationDays: Number(reactivation),
            })
          }
        >
          Guardar
        </button>
      )}
      <label className="ml-auto flex items-center gap-2 font-sans text-sm text-secondary">
        {rule.isActive ? "Activa" : "Pausada"}
        <CatalogSwitch
          checked={rule.isActive}
          label={rule.isActive ? "Pausar regla" : "Activar regla"}
          onChange={(isActive) =>
            void actions.updateAutomationRule(rule.id, { isActive })
          }
        />
      </label>
    </li>
  );
}

function RulesCard({ actions }: { actions: ConduitActions }) {
  const categories = useCategories();
  const [categoryId, setCategoryId] = useState("");
  const effectiveCategory = categoryId || categories.data?.[0]?.id || "";
  const rules = useAutomationRules(
    effectiveCategory ? { categoryId: effectiveCategory } : undefined,
  );
  const [reminder, setReminder] = useState("1");
  const [reactivation, setReactivation] = useState("60");

  return (
    <SectionCard
      title="Recordatorios y reactivación"
      icon={<Repeat className="size-5" strokeWidth={1.7} />}
      description="La reactivación solo llega a clientas que hayan escrito al WhatsApp del spa dentro de la ventana de la política anti-bloqueo."
    >
      <Field label="Categoría" htmlFor="rules-category">
        <select
          id="rules-category"
          value={effectiveCategory}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`${INPUT_CLASS} max-w-xs`}
        >
          {(categories.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      {rules.isError && (
        <ErrorPanel
          error={rules.error}
          onRetry={() => void rules.refetch()}
          compact
        />
      )}
      {rules.isLoading && effectiveCategory && (
        <SkeletonRows rows={1} height="h-16" />
      )}
      <ul className="flex flex-col gap-2">
        {(rules.data ?? []).map((rule) => (
          <RuleRow
            key={`${rule.id}-${rule.reminderDays}-${rule.reactivationDays}`}
            rule={rule}
            actions={actions}
          />
        ))}
      </ul>
      {effectiveCategory &&
        (rules.data ?? []).length === 0 &&
        !rules.isLoading && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void actions.createAutomationRule({
                categoryId: effectiveCategory,
                reminderDays: reminder ? Number(reminder) : undefined,
                reactivationDays: Number(reactivation),
              });
            }}
            className="flex flex-wrap items-end gap-3 rounded-[1.25rem] border border-dashed border-tertiary/50 p-3"
          >
            <Field label="Recordar (días antes)" htmlFor="new-rem">
              <input
                id="new-rem"
                inputMode="numeric"
                value={reminder}
                onChange={(e) => setReminder(e.target.value.replace(/\D/g, ""))}
                className={`${INPUT_CLASS} h-10 w-28 tabular-nums`}
              />
            </Field>
            <Field label="Reactivar tras (días)" htmlFor="new-rea">
              <input
                id="new-rea"
                inputMode="numeric"
                value={reactivation}
                onChange={(e) =>
                  setReactivation(e.target.value.replace(/\D/g, ""))
                }
                className={`${INPUT_CLASS} h-10 w-28 tabular-nums`}
              />
            </Field>
            <button
              type="submit"
              className={`${PRIMARY_BUTTON} h-10`}
              disabled={!reactivation || actions.busy.has("rule:new")}
            >
              <Plus className="size-4" />
              Crear regla
            </button>
          </form>
        )}
    </SectionCard>
  );
}

function RecipientsCheckCard({
  windowDays,
  spaPhone,
}: {
  windowDays: number;
  spaPhone: string | null;
}) {
  const spaDigits = spaPhone?.replace(/\D/g, "") ?? "";
  const recipients = useNotificationRecipients();
  const contacts = useConduitContacts({ limit: 100 });
  const nowMs = useMinuteClock();
  const cutoff = nowMs - windowDays * 24 * 60 * 60 * 1000;
  const lastInbound = new Map(
    (contacts.data?.data ?? []).map((c) => [
      c.address.replace(/\D/g, ""),
      c.lastInboundAt,
    ]),
  );

  return (
    <SectionCard
      title="Destinatarios de avisos internos"
      description="Números del equipo que reciben depósitos vencidos, reprogramaciones, cancelaciones y traspasos."
      aside={
        <Link href="/admin/settings" className={`${SECONDARY_BUTTON} h-10`}>
          Administrar en Ajustes
        </Link>
      }
    >
      {recipients.isError && (
        <ErrorPanel
          error={recipients.error}
          onRetry={() => void recipients.refetch()}
          compact
        />
      )}
      <ul className="flex flex-col gap-2">
        {(recipients.data ?? []).map((recipient) => {
          const digits = recipient.phone.replace(/\D/g, "");
          const at = lastInbound.get(digits);
          const eligible = Boolean(at && new Date(at).getTime() >= cutoff);
          const isSpaNumber = spaDigits !== "" && digits === spaDigits;
          return (
            <li
              key={recipient.id}
              className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold text-secondary">
                  {recipient.name}
                </p>
                <p className="font-sans text-sm text-secondary/75 tabular-nums">
                  {formatWhatsappPhone(recipient.phone)}
                </p>
              </div>
              {!recipient.isActive ? (
                <StatusPill tone="gray">Pausado</StatusPill>
              ) : isSpaNumber ? (
                <span className="flex max-w-64 flex-col items-end gap-1 text-right">
                  <StatusPill tone="amber">Es el número del spa</StatusPill>
                  <span className="font-sans text-[11px] text-secondary/70">
                    WhatsApp no avisa de mensajes enviados a uno mismo. Usa otro
                    número, por ejemplo tu WhatsApp personal en el mismo
                    celular.
                  </span>
                </span>
              ) : eligible ? (
                <StatusPill tone="green">Puede recibir avisos</StatusPill>
              ) : (
                <span className="flex flex-col items-end gap-1">
                  <StatusPill tone="amber">No puede recibir avisos</StatusPill>
                  <span className="font-sans text-[11px] text-secondary/70">
                    Pídele que le escriba una vez al WhatsApp del spa.
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

export function TemplatesSection() {
  const templates = useConduitTemplates();
  const overview = useConduitOverview();
  const actions = useConduitActions();
  const [editor, setEditor] = useState<EditorState>({
    open: false,
    template: null,
    usage: null,
    version: 0,
  });
  const open = (
    template: ConduitTemplate | null,
    usage: TemplateUsage | null,
  ) =>
    setEditor((current) => ({
      open: true,
      template,
      usage,
      version: current.version + 1,
    }));
  const list = templates.data?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <UsageCard templates={list} onCreate={(usage) => open(null, usage)} />
      {templates.isError ? (
        <ErrorPanel
          error={templates.error}
          onRetry={() => void templates.refetch()}
        />
      ) : templates.isLoading ? (
        <SkeletonRows rows={2} height="h-32" />
      ) : (
        <TemplatesCard
          templates={list}
          actions={actions}
          onEdit={(t) => open(t, null)}
          onCreate={() => open(null, null)}
        />
      )}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <RulesCard actions={actions} />
        <RecipientsCheckCard
          windowDays={overview.data?.connection?.inboundLookbackDays ?? 180}
          spaPhone={overview.data?.connection?.phoneNumber ?? null}
        />
      </div>
      <TemplateEditorDialog
        key={editor.version}
        open={editor.open}
        template={editor.template}
        usage={editor.usage}
        onOpenChange={(next) =>
          setEditor((current) => ({ ...current, open: next }))
        }
        onSave={actions.saveTemplate}
      />
    </div>
  );
}
