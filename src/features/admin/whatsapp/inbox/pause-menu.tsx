"use client";

import { useState } from "react";
import { PauseCircle } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

import { SECONDARY_BUTTON } from "../components/section-card";
import {
  PAUSE_OPTIONS,
  minutesUntilTomorrowMorning,
} from "../lib/whatsapp-format";

export function PauseMenu({
  nowMs,
  disabled,
  onPause,
}: {
  nowMs: number;
  disabled?: boolean;
  onPause: (minutes: number, reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            className={`${SECONDARY_BUTTON} h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm`}
          >
            <PauseCircle className="size-4" strokeWidth={1.8} />
            Pausar asistente
          </button>
        }
      />
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 rounded-2xl border border-tertiary/30 bg-primary p-2 shadow-[0_20px_50px_-20px_rgba(6,33,18,0.28)]"
      >
        <p className="px-2 pt-1 pb-2 font-sans text-xs text-secondary/70">
          Pausar en este chat durante…
        </p>
        {PAUSE_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => {
              setOpen(false);
              onPause(
                option.minutes || minutesUntilTomorrowMorning(nowMs),
                "Atiende el equipo del spa",
              );
            }}
            className="flex w-full cursor-pointer rounded-xl px-2 py-2 text-left font-sans text-sm text-secondary hover:bg-quaternary/35"
          >
            {option.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
