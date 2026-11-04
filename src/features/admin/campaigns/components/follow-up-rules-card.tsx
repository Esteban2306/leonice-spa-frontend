"use client";

import { useState } from "react";
import { Plus, Repeat, Trash2 } from "lucide-react";

import {
  Field,
  INPUT_CLASS,
} from "@/src/features/admin/components/reservation-actions/form-controls";
import { CatalogSwitch } from "@/src/features/admin/services/components/catalog-switch";
import {
  useAutomationRules,
  useFollowUpTemplates,
} from "@/src/features/admin/hooks/use-automation-rules";
import { useCategories } from "@/src/features/admin/hooks/use-categories";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";
import { usePromotions } from "@/src/features/admin/hooks/use-promotions";
import { useTreatments } from "@/src/features/admin/hooks/use-treatments";
import type {
  AutomationRule,
  FollowUpTemplate,
} from "@/src/features/admin/types/automation.types";

import { ErrorPanel } from "@/src/features/admin/whatsapp/components/error-panel";
import {
  PRIMARY_BUTTON,
  SectionCard,
  SkeletonRows,
} from "@/src/features/admin/whatsapp/components/section-card";

type RuleKind = "FOLLOW_UP" | "REMINDER";

const dayWord = (days: number) => (days === 1 ? "día" : "días");

function ruleSummary(
  rule: AutomationRule,
  templates: readonly FollowUpTemplate[],
): string[] {
  const lines: string[] = [];
  if (rule.reminderDays !== null) {
    lines.push(
      `Recordatorio de la cita ${rule.reminderDays} ${dayWord(rule.reminderDays)} antes`,
    );
  }
  if (rule.reactivationDays !== null) {
    const template = templates.find((item) => item.code === rule.templateCode);
    lines.push(
      `Seguimiento ${rule.reactivationDays} ${dayWord(rule.reactivationDays)} después de la cita · ${
        template?.label ?? "Mensaje de reactivación"
      }`,
    );
  }
  return lines;
}

function RuleRow({
  rule,
  templates,
  actions,
}: {
  rule: AutomationRule;
  templates: readonly FollowUpTemplate[];
  actions: ConduitActions;
}) {
  const busy = actions.busy.has(`rule:${rule.id}`);
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-[1.25rem] border border-tertiary/25 bg-white/80 p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {ruleSummary(rule, templates).map((line) => (
          <p key={line} className="font-sans text-sm text-secondary">
            {line}
          </p>
        ))}
      </div>
      <label className="flex items-center gap-2 font-sans text-sm text-secondary">
        {rule.isActive ? "Activa" : "Pausada"}
        <CatalogSwitch
          checked={rule.isActive}
          label={rule.isActive ? "Pausar regla" : "Activar regla"}
          onChange={(isActive) =>
            void actions.updateAutomationRule(rule.id, { isActive })
          }
        />
      </label>
      <button
        type="button"
        aria-label="Eliminar regla"
        disabled={busy}
        onClick={() => void actions.removeAutomationRule(rule.id)}
        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-secondary/70 hover:bg-secondary/5 disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

export function FollowUpRulesCard({ actions }: { actions: ConduitActions }) {
  const categories = useCategories();
  const [categoryId, setCategoryId] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const effectiveCategory = categoryId || categories.data?.[0]?.id || "";
  const treatments = useTreatments(
    effectiveCategory ? { categoryId: effectiveCategory } : undefined,
  );
  const target = treatmentId
    ? { treatmentId }
    : effectiveCategory
      ? { categoryId: effectiveCategory }
      : undefined;
  const rules = useAutomationRules(target);
  const templates = useFollowUpTemplates();
  const promotions = usePromotions({ isActive: true, currentlyValid: true });

  const [kind, setKind] = useState<RuleKind>("FOLLOW_UP");
  const [days, setDays] = useState("30");
  const [templateCode, setTemplateCode] = useState("MAINTENANCE_REMINDER");
  const [promotionId, setPromotionId] = useState("");

  const templateList = templates.data ?? [];
  const template = templateList.find((item) => item.code === templateCode);
  const needsPromotion = kind === "FOLLOW_UP" && template?.needsPromotion;
  const canCreate =
    target !== undefined &&
    Number(days) > 0 &&
    (kind === "REMINDER" || template !== undefined) &&
    (!needsPromotion || promotionId !== "");

  return (
    <SectionCard
      title="Mensajes automáticos por tratamiento"
      icon={<Repeat className="size-5" strokeWidth={1.7} />}
      description="Elige un tratamiento (o toda su categoría) y programa un mensaje para unos días después de la cita, por ejemplo un recordatorio de mantenimiento. Solo llega a clientas con consentimiento de marketing que hayan escrito al spa. Si el tratamiento tiene reglas propias, se usan esas en lugar de las de su categoría."
    >
      <div className="flex flex-wrap gap-3">
        <Field label="Categoría" htmlFor="rules-category">
          <select
            id="rules-category"
            value={effectiveCategory}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setTreatmentId("");
            }}
            className={`${INPUT_CLASS} max-w-xs`}
          >
            {(categories.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tratamiento" htmlFor="rules-treatment">
          <select
            id="rules-treatment"
            value={treatmentId}
            onChange={(e) => setTreatmentId(e.target.value)}
            className={`${INPUT_CLASS} max-w-xs`}
          >
            <option value="">Toda la categoría</option>
            {(treatments.data ?? []).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {rules.isError && (
        <ErrorPanel
          error={rules.error}
          onRetry={() => void rules.refetch()}
          compact
        />
      )}
      {rules.isLoading && target && <SkeletonRows rows={1} height="h-16" />}
      <ul className="flex flex-col gap-2">
        {(rules.data ?? []).map((rule) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            templates={templateList}
            actions={actions}
          />
        ))}
      </ul>
      {target && !rules.isLoading && (rules.data ?? []).length === 0 && (
        <p className="font-sans text-sm text-secondary/70">
          Todavía no hay mensajes automáticos para esta selección.
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!target || !canCreate) return;
          void actions.createAutomationRule({
            ...target,
            ...(kind === "REMINDER"
              ? { reminderDays: Number(days) }
              : {
                  reactivationDays: Number(days),
                  templateCode,
                  ...(needsPromotion ? { promotionId } : {}),
                }),
          });
        }}
        className="flex flex-col gap-3 rounded-[1.25rem] border border-dashed border-tertiary/50 p-3"
      >
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Qué enviar" htmlFor="rule-kind">
            <select
              id="rule-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as RuleKind)}
              className={INPUT_CLASS}
            >
              <option value="FOLLOW_UP">Seguimiento después de la cita</option>
              <option value="REMINDER">Recordatorio antes de la cita</option>
            </select>
          </Field>
          <Field
            label={kind === "FOLLOW_UP" ? "Días después" : "Días antes"}
            htmlFor="rule-days"
          >
            <input
              id="rule-days"
              inputMode="numeric"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))}
              className={`${INPUT_CLASS} h-10 w-28 tabular-nums`}
            />
          </Field>
          {kind === "FOLLOW_UP" && (
            <Field label="Mensaje" htmlFor="rule-template">
              <select
                id="rule-template"
                value={templateCode}
                onChange={(e) => {
                  setTemplateCode(e.target.value);
                  setPromotionId("");
                }}
                className={INPUT_CLASS}
              >
                {templateList.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
          )}
          {needsPromotion && (
            <Field label="Promoción" htmlFor="rule-promotion">
              <select
                id="rule-promotion"
                value={promotionId}
                onChange={(e) => setPromotionId(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Elige una promoción</option>
                {(promotions.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {Number(item.discountPercentage)}%
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>
        {kind === "FOLLOW_UP" && template && (
          <pre className="whitespace-pre-wrap rounded-2xl bg-white p-3 font-sans text-sm leading-relaxed text-secondary/85">
            {template.body}
          </pre>
        )}
        <button
          type="submit"
          className={`${PRIMARY_BUTTON} h-10 w-fit`}
          disabled={!canCreate || actions.busy.has("rule:new")}
        >
          <Plus className="size-4" />
          Crear mensaje automático
        </button>
      </form>
    </SectionCard>
  );
}
