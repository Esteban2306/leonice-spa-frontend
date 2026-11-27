"use client";

import {
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getBogotaDayKey } from "@/src/lib/date/bogota";
import { useBookingActions } from "@/src/features/admin/hooks/use-booking-actions";
import { useCategories } from "@/src/features/admin/hooks/use-categories";
import { useClient, useClients } from "@/src/features/admin/hooks/use-clients";
import { useAvailabilityCalendar } from "@/src/features/admin/hooks/use-reservations";
import { useTreatments } from "@/src/features/admin/hooks/use-treatments";

import { toAgreedPrices, toBookingService } from "../lib/booking";
import {
  EMPTY_DRAFT,
  availabilityWindow,
  missingFor,
  nextStep,
  parseStep,
  previousStep,
  resolveStep,
  windowPageOf,
  wizardReducer,
  type WizardAction,
  type WizardDraft,
  type WizardStep,
} from "../lib/booking-wizard";
import { getBusinessToday } from "../lib/calendar-dates";

const CLIENT_SEARCH_MIN_LENGTH = 2;

export function useBookingWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [presetClientId, setPresetClientId] = useState(() =>
    searchParams.get("clientId"),
  );
  const [today] = useState(() => getBusinessToday());
  const [draft, dispatch] = useReducer(wizardReducer, EMPTY_DRAFT);
  const [hasAppliedPreset, setHasAppliedPreset] = useState(false);
  const [isEditingFromReview, setIsEditingFromReview] = useState(false);
  const [clientQuery, setClientQuery] = useState("");
  const [page, setPage] = useState(0);
  const [created, setCreated] = useState<{
    summary: string;
    href: string;
  } | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  const presetQuery = useClient(presetClientId ?? "");
  const preset = presetClientId ? presetQuery.data : undefined;
  if (preset && !hasAppliedPreset) {
    setHasAppliedPreset(true);
    dispatch({
      type: "pickClient",
      client: {
        id: preset.id,
        name: preset.name,
        phone: preset.phone,
        missingBirthDate: preset.birthDate === null,
      },
    });
  }

  const defaultStep: WizardStep =
    preset && preset.birthDate !== null ? "servicio" : "cliente";
  const requestedStep = parseStep(searchParams.get("paso"));
  const step = resolveStep(requestedStep ?? defaultStep, draft);

  const deferredQuery = useDeferredValue(clientQuery.trim());
  const isLongEnough = deferredQuery.length >= CLIENT_SEARCH_MIN_LENGTH;
  const clientsQuery = useClients(
    { q: deferredQuery, pageSize: 5 },
    { enabled: isLongEnough },
  );
  const categoriesQuery = useCategories();
  const treatmentsQuery = useTreatments();
  const categories = categoriesQuery.data ?? [];
  const treatments = treatmentsQuery.data ?? [];

  const services = Object.values(draft.selection).flatMap((treatmentId) => {
    const treatment = treatments.find((t) => t.id === treatmentId);
    if (!treatment) return [];
    const category = categories.find((c) => c.id === treatment.categoryId);
    return [toBookingService(treatment, category?.name ?? "")];
  });

  // Fuera del paso del día, la ventana es la que contiene el día elegido.
  const visiblePage =
    step !== "dia" && draft.dayKey ? windowPageOf(today, draft.dayKey) : page;
  const treatmentIds = Object.values(draft.selection);
  const availabilityQuery = useAvailabilityCalendar(
    treatmentIds.length > 0
      ? {
          treatmentIds: treatmentIds.join(","),
          ...availabilityWindow(today, visiblePage),
          purpose: "CREATE",
        }
      : null,
  );
  const days = availabilityQuery.data?.days ?? [];
  const selectedDay = days.find((day) => day.date === draft.dayKey) ?? null;
  const isAvailabilityLoading =
    availabilityQuery.isLoading || availabilityQuery.isPlaceholderData;

  const bookingActions = useBookingActions();
  const slotTaken =
    step === "revisar" &&
    !bookingActions.isSubmitting &&
    !availabilityQuery.isFetching &&
    availabilityQuery.isSuccess &&
    !selectedDay?.slots.some((slot) => slot.iso === draft.slotIso);

  const hrefFor = (target: WizardStep) => {
    const params = new URLSearchParams({ paso: target });
    if (presetClientId) params.set("clientId", presetClientId);
    return `${pathname}?${params.toString()}`;
  };

  // Tras recargar, la dirección puede pedir un paso aún incompleto: se corrige
  // para que la pantalla no salte sola al ir completando datos.
  const isPresetLoading = Boolean(presetClientId) && presetQuery.isLoading;
  const staleHref =
    requestedStep && requestedStep !== step && !isPresetLoading
      ? hrefFor(step)
      : null;
  useEffect(() => {
    if (staleHref) router.replace(staleHref, { scroll: false });
  }, [staleHref, router]);

  // Pasos que quedaron atrás en el historial del navegador.
  const trail = useRef<WizardStep[]>([]);
  useEffect(() => {
    const onPopState = () => {
      trail.current.pop();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const goTo = (target: WizardStep) => {
    trail.current.push(step);
    setHasFailed(false);
    router.push(hrefFor(target), { scroll: false });
  };

  /** Aplica la elección y avanza; al corregir desde el resumen, vuelve a él. */
  const advance = (...actions: WizardAction[]) => {
    actions.forEach(dispatch);
    const next: WizardDraft = actions.reduce(wizardReducer, draft);
    if (missingFor(step, next) !== null) return;
    if (isEditingFromReview) {
      const target = resolveStep("revisar", next);
      if (target === "revisar") setIsEditingFromReview(false);
      goTo(target);
      return;
    }
    goTo(nextStep(step));
  };

  const change = (target: WizardStep) => {
    setIsEditingFromReview(true);
    goTo(target);
  };

  const previous = previousStep(step);
  const back = previous
    ? () => {
        if (trail.current.at(-1) === previous) router.back();
        else router.replace(hrefFor(previous), { scroll: false });
      }
    : null;

  const submit = async () => {
    if (!draft.slotIso || missingFor("revisar", draft) || slotTaken) return;
    setHasFailed(false);
    const client = draft.picked
      ? {
          phone: draft.picked.phone,
          ...(draft.picked.missingBirthDate && { birthDate: draft.birthDate }),
        }
      : {
          phone: draft.phone,
          name: draft.name.trim(),
          birthDate: draft.birthDate,
        };
    const result = await bookingActions.create({
      treatmentIds: services.map((service) => service.treatmentId),
      scheduledStart: draft.slotIso,
      agreedPrices: toAgreedPrices(draft.prices),
      client,
    });
    if (!result) {
      setHasFailed(true);
      return;
    }
    const first = result.reservations[0];
    const startsAt = first?.scheduledStart ?? draft.slotIso;
    const params = new URLSearchParams({
      date: getBogotaDayKey(new Date(startsAt)),
    });
    if (first) params.set("reservationId", first.id);
    setCreated({
      summary: result.summary,
      href: `/admin/calendar?${params.toString()}`,
    });
  };

  const clearClient = () => {
    setPresetClientId(null);
    dispatch({ type: "clearClient" });
  };

  const restart = () => {
    dispatch({ type: "reset" });
    setPresetClientId(null);
    setClientQuery("");
    setPage(0);
    setIsEditingFromReview(false);
    setCreated(null);
    router.replace(pathname);
  };

  return {
    today,
    draft,
    dispatch,
    step,
    isPresetLoading,
    // La persona que ya venía elegida desde su ficha no cuenta como algo escrito.
    hasData:
      draft.isNewClient ||
      draft.birthDate !== "" ||
      Object.keys(draft.selection).length > 0 ||
      (draft.picked !== null && !presetClientId),
    clearClient,
    exitHref: presetClientId
      ? `/admin/clients/${presetClientId}`
      : "/admin/calendar",
    clientSearch: {
      query: clientQuery,
      results: clientsQuery.data?.data ?? [],
      isSearching:
        clientsQuery.isFetching || deferredQuery !== clientQuery.trim(),
      isError: clientsQuery.isError,
      isLongEnough,
      onQueryChange: setClientQuery,
      onRetry: () => void clientsQuery.refetch(),
    },
    categories,
    treatments,
    services,
    isCatalogLoading: categoriesQuery.isLoading || treatmentsQuery.isLoading,
    isCatalogError: categoriesQuery.isError || treatmentsQuery.isError,
    retryCatalog: () => {
      void categoriesQuery.refetch();
      void treatmentsQuery.refetch();
    },
    days,
    selectedDay,
    isAvailabilityLoading,
    isAvailabilityError: availabilityQuery.isError,
    retryAvailability: () => void availabilityQuery.refetch(),
    showEarlier: page > 0 ? () => setPage(page - 1) : null,
    showLater: days.some((day) => day.reason !== "OUT_OF_RANGE")
      ? () => setPage(page + 1)
      : null,
    slotTaken,
    hasFailed,
    isSubmitting: bookingActions.isSubmitting,
    created,
    advance,
    goTo,
    change,
    back,
    submit,
    restart,
  };
}
