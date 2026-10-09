import { ActionDialog } from "@/src/features/admin/components/reservation-actions/action-dialog";

export interface ToggleConfirmation {
  title: string;
  description: string;
  submitLabel: string;
  onConfirm: () => Promise<boolean>;
}

interface ConfirmToggleDialogProps {
  confirmation: ToggleConfirmation | null;
  onClose: () => void;
}

export function ConfirmToggleDialog({
  confirmation,
  onClose,
}: ConfirmToggleDialogProps) {
  return (
    <ActionDialog
      open={confirmation !== null}
      onOpenChange={(open) => !open && onClose()}
      title={confirmation?.title ?? ""}
      description={confirmation?.description}
      submitLabel={confirmation?.submitLabel ?? "Confirmar"}
      submittingLabel="Guardando…"
      tone="danger"
      onSubmit={() => confirmation?.onConfirm() ?? Promise.resolve(false)}
    />
  );
}
