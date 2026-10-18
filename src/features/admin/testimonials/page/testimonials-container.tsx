"use client";

import { useState } from "react";

import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";
import { useTestimonialActions } from "../../hooks/use-testimonial-actions";
import { useAdminTestimonials } from "../../hooks/use-testimonials";
import type { AdminTestimonial } from "../../types/testimonials.types";

import {
  TestimonialDialog,
  type TestimonialDialogTarget,
} from "../components/testimonial-dialog";
import { moveId } from "../lib/testimonial-form";
import { TestimonialsView } from "./testimonials-view";

export function TestimonialsContainer() {
  const query = useAdminTestimonials();
  const actions = useTestimonialActions();
  const [targetId, setTargetId] = useState<"new" | string | null>(null);
  const [deleting, setDeleting] = useState<AdminTestimonial | null>(null);
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());

  const testimonials = query.data ?? [];
  const editing = testimonials.find((item) => item.id === targetId);
  const target: TestimonialDialogTarget | null =
    targetId === "new" ? "new" : (editing ?? null);

  const withBusy = async (id: string, run: () => Promise<boolean>) => {
    setBusyIds((prev) => new Set(prev).add(id));
    try {
      return await run();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <>
      <TestimonialsView
        testimonials={testimonials}
        isLoading={query.isLoading}
        isError={query.isError}
        busyIds={busyIds}
        isReordering={actions.isReordering}
        onCreate={() => setTargetId("new")}
        onRetry={() => void query.refetch()}
        handlers={{
          onEdit: (item) => setTargetId(item.id),
          onDelete: setDeleting,
          onTogglePublished: (item, next) =>
            void withBusy(item.id, () => actions.setPublished(item.id, next)),
          onMove: (item, delta) => {
            const ids = moveId(
              testimonials.map((entry) => entry.id),
              item.id,
              delta,
            );
            if (ids) void actions.reorder(ids);
          },
        }}
      />

      <TestimonialDialog
        key={target === "new" ? "new" : (editing?.id ?? "closed")}
        target={target}
        actions={actions}
        onClose={() => setTargetId(null)}
      />

      <ActionDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar este testimonio?"
        description={`Se borrará el testimonio de ${deleting?.authorName ?? ""} junto con sus fotos. Si solo quieres quitarlo de la web, ocúltalo.`}
        submitLabel="Eliminar"
        submittingLabel="Eliminando…"
        tone="danger"
        onSubmit={() =>
          deleting ? actions.remove(deleting.id) : Promise.resolve(false)
        }
      />
    </>
  );
}
