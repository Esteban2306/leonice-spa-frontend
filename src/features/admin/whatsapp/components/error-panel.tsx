"use client";

import { useState } from "react";
import { Copy, RefreshCcw } from "lucide-react";

import { HttpError } from "@/src/lib/api/http-error";
import { normalizeError } from "@/src/lib/errors/normalize-error";

export function ErrorPanel({
  error,
  onRetry,
  compact,
}: {
  error: unknown;
  onRetry?: () => void;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { message, code } = normalizeError(error);
  const correlationId = error instanceof HttpError ? error.correlationId : null;
  const missing =
    error instanceof HttpError &&
    error.details &&
    typeof error.details === "object"
      ? (error.details as { missing?: string }).missing
      : undefined;
  const canRetry = onRetry && code !== "CONDUIT_NOT_CONFIGURED";

  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 font-sans text-sm text-red-900 ${compact ? "p-3" : "p-4"}`}
    >
      <p>
        {message}
        {missing && (
          <span className="block text-xs text-red-800">
            Falta configurar: {missing}
          </span>
        )}
      </p>
      {(canRetry || correlationId) && (
        <div className="flex flex-wrap gap-2">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-red-700 px-4 text-xs font-medium text-white hover:bg-red-800"
            >
              <RefreshCcw className="size-3.5" />
              Reintentar
            </button>
          )}
          {correlationId && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(correlationId)
                  .then(() => setCopied(true));
              }}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-red-300 px-4 text-xs text-red-900 hover:bg-red-100"
            >
              <Copy className="size-3.5" />
              {copied ? "Código copiado" : "Copiar código de soporte"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
