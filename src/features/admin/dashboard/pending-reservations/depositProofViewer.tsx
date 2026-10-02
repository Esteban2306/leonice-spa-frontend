"use client";

import Image from "next/image";
import { Eye, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface DepositProofViewerProps {
  proofUrl: string;
  clientName: string;
}

export function DepositProofViewer({
  proofUrl,
  clientName,
}: DepositProofViewerProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            aria-label={`Ver comprobante de ${clientName}`}
            className="group relative size-14 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-tertiary/30 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:scale-[1.03] hover:border-tertiary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary/60 focus-visible:ring-offset-2"
          />
        }
      >
        <Image
          src={proofUrl}
          alt="Comprobante de pago"
          fill
          sizes="56px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <span className="absolute inset-0 flex items-center justify-center bg-secondary/0 text-primary opacity-0 transition-[background-color,opacity] duration-300 group-hover:bg-secondary/60 group-hover:opacity-100">
          <Eye
            className="size-5 transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </span>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60 duration-200 supports-backdrop-filter:backdrop-blur-none"
        className="w-auto max-w-none gap-0 border-0 bg-transparent p-0 shadow-none ring-0 duration-200 sm:max-w-none"
      >
        <DialogTitle className="sr-only">
          Comprobante de pago de {clientName}
        </DialogTitle>

        <DialogDescription className="sr-only">
          Vista ampliada del comprobante de pago enviado por {clientName}.
        </DialogDescription>

        <div className="relative h-[70dvh] w-[72vw] max-w-5xl">
          <Image
            src={proofUrl}
            alt={`Comprobante de pago de ${clientName}`}
            fill
            loading="eager"
            sizes="(max-width: 1024px) 72vw, 1024px"
            className="object-contain"
          />

          <DialogClose
            className="absolute right-2 top-2 z-10 flex size-10 items-center justify-center rounded-full border border-primary/20 bg-primary/95 text-secondary shadow-lg transition-[transform,background-color] duration-200 hover:scale-105 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary sm:right-4 sm:top-4"
            aria-label="Cerrar comprobante"
          >
            <X className="size-5" strokeWidth={1.8} />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
