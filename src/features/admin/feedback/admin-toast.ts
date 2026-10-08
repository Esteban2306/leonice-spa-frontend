import { toast } from "@/src/components/ui/toast";
import { normalizeError } from "@/src/lib/errors/normalize-error";

const SUCCESS_TIMEOUT_MS = 4_000;
const ERROR_TIMEOUT_MS = 8_000;
const INFO_TIMEOUT_MS = 6_000;

export function toastSuccess(title: string, description?: string): void {
  toast.add({
    type: "success",
    title,
    description,
    timeout: SUCCESS_TIMEOUT_MS,
  });
}

export function toastInfo(title: string, description?: string): void {
  toast.add({ type: "info", title, description, timeout: INFO_TIMEOUT_MS });
}

export function toastError(title: string, error: unknown): void {
  const { message } = normalizeError(error);

  toast.add({
    type: "error",
    title,
    description: message,
    priority: "high",
    timeout: ERROR_TIMEOUT_MS,
  });
}
