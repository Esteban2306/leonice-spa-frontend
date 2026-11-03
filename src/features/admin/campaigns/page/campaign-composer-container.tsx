"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { useDebouncedValue } from "@/src/features/admin/hooks/use-debounced-value";
import {
  useAudiencePreview,
  useBroadcastTemplates,
  useCampaignActions,
  useCampaignEstimate,
} from "@/src/features/admin/hooks/use-campaigns";
import { usePromotions } from "@/src/features/admin/hooks/use-promotions";
import { useMinuteClock } from "@/src/lib/date/use-minute-clock";
import type {
  AudienceFilter,
  CampaignDraft,
  PaceProfile,
} from "@/src/features/admin/types/campaigns.types";

import {
  dateTimeLocalToIso,
  formatDateTime,
  formatDuration,
  paceLabel,
} from "../lib/campaign-format";
import { CampaignComposerView } from "./campaign-composer-view";

const FILTER_DEBOUNCE_MS = 400;

export function CampaignComposerContainer() {
  const router = useRouter();
  const nowMs = useMinuteClock();
  const actions = useCampaignActions();
  const templatesQuery = useBroadcastTemplates();
  const promotionsQuery = usePromotions({ isActive: true });

  const [name, setName] = useState("");
  const [templateCode, setTemplateCode] = useState("");
  const [promotionId, setPromotionId] = useState("");
  const [filter, setFilter] = useState<AudienceFilter>({
    tags: ["APTA_PROMOCION"],
  });
  const [pace, setPace] = useState<PaceProfile>("EQUILIBRADO");
  const [startMode, setStartMode] = useState<"now" | "later">("now");
  const [startLocal, setStartLocal] = useState("");
  const [confirming, setConfirming] = useState(false);

  const templates = useMemo(
    () => templatesQuery.data ?? [],
    [templatesQuery.data],
  );
  const template = templates.find((item) => item.code === templateCode);

  const promotions = useMemo(
    () =>
      (promotionsQuery.data ?? []).filter(
        (promotion) => new Date(promotion.endsAt).getTime() > nowMs,
      ),
    [promotionsQuery.data, nowMs],
  );

  const filterKey = JSON.stringify(filter);
  const debouncedFilter = useDebouncedValue(
    filter,
    FILTER_DEBOUNCE_MS,
    filterKey,
  );
  const startAt =
    startMode === "later" ? dateTimeLocalToIso(startLocal) : undefined;

  const previewQuery = useAudiencePreview(debouncedFilter, true);

  const ready =
    template !== undefined &&
    (!template.needsPromotion || promotionId !== "") &&
    (startMode === "now" || startAt !== undefined);
  const draft: CampaignDraft | null = ready
    ? {
        templateCode,
        ...(template?.needsPromotion ? { promotionId } : {}),
        filter: debouncedFilter,
        pace,
        ...(startAt ? { startAt } : {}),
      }
    : null;
  const estimateQuery = useCampaignEstimate(draft);

  const canLaunch =
    ready &&
    name.trim().length >= 2 &&
    template?.configured === true &&
    (estimateQuery.data?.schedule.count ?? 0) > 0 &&
    !estimateQuery.isFetching;

  const launch = async () => {
    if (!draft) return false;
    const created = await actions.create({ ...draft, name: name.trim() });
    if (created) router.push(`/admin/campaigns/${created.id}`);
    return created !== null;
  };

  const schedule = estimateQuery.data?.schedule;

  return (
    <>
      <CampaignComposerView
        name={name}
        templates={templates}
        templateCode={templateCode}
        promotions={promotions}
        promotionId={promotionId}
        filter={filter}
        pace={pace}
        startMode={startMode}
        startLocal={startLocal}
        preview={previewQuery.data}
        isPreviewLoading={previewQuery.isFetching}
        isPreviewError={previewQuery.isError}
        estimate={estimateQuery.data}
        estimateError={
          estimateQuery.isError
            ? "No se pudo calcular el envío. Revisa el mensaje y la promoción elegidos."
            : null
        }
        canLaunch={canLaunch}
        onNameChange={setName}
        onTemplateChange={(code) => {
          setTemplateCode(code);
          setPromotionId("");
        }}
        onPromotionChange={setPromotionId}
        onFilterChange={setFilter}
        onPaceChange={setPace}
        onStartModeChange={setStartMode}
        onStartLocalChange={setStartLocal}
        onLaunch={() => setConfirming(true)}
      />

      <ActionDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Lanzar campaña"
        description={
          schedule && schedule.count > 0
            ? `Se enviarán ${schedule.count} mensajes con el ritmo ${paceLabel(pace).toLowerCase()}, desde ${formatDateTime(schedule.firstAt)} hasta ${formatDateTime(schedule.lastAt)} (${formatDuration(schedule.days)}). Puedes pausarla o cancelarla cuando quieras.`
            : "Revisa los datos antes de lanzar."
        }
        submitLabel="Lanzar campaña"
        submittingLabel="Lanzando…"
        onSubmit={launch}
      />
    </>
  );
}
