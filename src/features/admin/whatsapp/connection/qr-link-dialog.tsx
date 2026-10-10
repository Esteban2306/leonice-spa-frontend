"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, RefreshCcw } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useConduitQr } from "@/src/features/admin/hooks/use-conduit";
import type { ConduitActions } from "@/src/features/admin/hooks/use-conduit-actions";

import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "../components/section-card";

const RETRY_AFTER_MS = 2 * 60 * 1000;
const CLOSE_AFTER_SUCCESS_MS = 2500;

export function QrLinkDialog({
  open,
  actions,
  onClose,
}: {
  open: boolean;
  actions: ConduitActions;
  onClose: () => void;
}) {
  const qr = useConduitQr(open);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [shownQr, setShownQr] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status = qr.data?.status;
  const latestQr = qr.data?.lastQr ?? null;
  if (latestQr && latestQr !== shownQr) setShownQr(latestQr);
  const isConnected = status === "CONNECTED";

  useEffect(() => {
    if (!open) return;
    const tick = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(tick);
  }, [open]);

  useEffect(() => {
    if (isConnected && open && !closeTimer.current) {
      closeTimer.current = setTimeout(() => {
        closeTimer.current = null;
        onClose();
      }, CLOSE_AFTER_SUCCESS_MS);
    }
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
  }, [isConnected, open, onClose]);

  const expired = !isConnected && now - startedAt > RETRY_AFTER_MS;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="gap-0 rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] p-0 sm:max-w-lg">
        <div className="flex flex-col gap-2 p-6 pb-3">
          <DialogTitle className="font-heading text-2xl text-secondary">
            {isConnected
              ? "¡Listo! WhatsApp quedó conectado"
              : "Vincular el WhatsApp del spa"}
          </DialogTitle>
          <DialogDescription className="font-sans text-sm text-secondary/75">
            {isConnected
              ? "El asistente y los recordatorios ya pueden usar el número."
              : "En el teléfono del spa abre WhatsApp Business → Dispositivos vinculados → Vincular un dispositivo y escanea este código."}
          </DialogDescription>
        </div>

        <div className="flex flex-col items-center gap-4 px-6 pb-6">
          {isConnected ? (
            <CheckCircle2
              className="my-8 size-20 text-green-700"
              strokeWidth={1.4}
            />
          ) : (
            <div className="grid size-72 place-items-center rounded-[1.5rem] border border-tertiary/30 bg-white p-3">
              {shownQr ? (
                <Image
                  src={shownQr}
                  alt="Código QR para vincular WhatsApp"
                  width={300}
                  height={300}
                  unoptimized
                  className="size-full object-contain"
                />
              ) : (
                <p className="px-6 text-center font-sans text-sm text-secondary/70">
                  {qr.isError
                    ? "No se pudo obtener el código. Reintenta."
                    : "Generando el código…"}
                </p>
              )}
            </div>
          )}
          {!isConnected && (
            <ol className="w-full list-decimal space-y-1 pl-5 font-sans text-sm text-secondary/80">
              <li>Abre WhatsApp Business en el teléfono del spa.</li>
              <li>
                Ve a Dispositivos vinculados y toca Vincular un dispositivo.
              </li>
              <li>
                Escanea el código. Cambia cada ~20 segundos; aquí se actualiza
                solo.
              </li>
            </ol>
          )}
          <p aria-live="polite" className="font-sans text-xs text-secondary/70">
            {isConnected
              ? "Conexión detectada."
              : status === "CONNECTING"
                ? "Esperando el escaneo…"
                : status
                  ? `Estado: ${status}`
                  : ""}
          </p>
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className={SECONDARY_BUTTON}
            >
              {isConnected ? "Cerrar" : "Cancelar"}
            </button>
            {(expired || qr.isError) && !isConnected && (
              <button
                type="button"
                className={PRIMARY_BUTTON}
                onClick={async () => {
                  const ok = await actions.reconnect();
                  if (ok) {
                    setStartedAt(Date.now());
                    setShownQr(null);
                    void qr.refetch();
                  }
                }}
              >
                <RefreshCcw className="size-4" />
                Generar un QR nuevo
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
