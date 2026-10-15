"use client";

import { useState, type FormEvent, type ReactElement, type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ActionDialogProps {
  trigger?: ReactElement;
  open?: boolean;
  title: string;
  description?: string;
  submitLabel: string;
  submittingLabel: string;
  tone?: "default" | "danger";
  canSubmit?: boolean;
  onSubmit: () => Promise<boolean>;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  children?: ReactNode;
}

export function ActionDialog({
  trigger,
  open: controlledOpen,
  title,
  description,
  submitLabel,
  submittingLabel,
  tone = "default",
  canSubmit = true,
  onSubmit,
  onOpenChange,
  contentClassName,
  children,
}: ActionDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const changeOpen = (next: boolean) => {
    if (isSubmitting) return;
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    const succeeded = await onSubmit();
    setIsSubmitting(false);

    if (succeeded) changeOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      {trigger && <DialogTrigger render={trigger} />}

      <DialogContent
        className={cn(
          "gap-0 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-0 sm:max-w-md",
          contentClassName,
        )}
      >
        <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col">
          <div className="flex flex-col gap-2 p-6 pb-4">
            <DialogTitle className="font-heading text-2xl text-secondary">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="font-sans text-sm text-secondary/65">
                {description}
              </DialogDescription>
            )}
          </div>

          {children && <div className="flex flex-col gap-4 px-6 pb-2">{children}</div>}

          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-tertiary/25 p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => changeOpen(false)}
              className="h-11 cursor-pointer rounded-full px-5 font-sans text-sm text-secondary/70 transition-colors hover:bg-secondary/5 disabled:opacity-50"
            >
              Volver
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className={cn(
                "h-11 cursor-pointer rounded-full px-6 font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                tone === "danger"
                  ? "bg-red-700 text-white hover:bg-red-800"
                  : "bg-secondary text-primary hover:bg-secondary/90",
              )}
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
