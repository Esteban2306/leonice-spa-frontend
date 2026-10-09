"use client";

import { useState, type ReactElement } from "react";
import type { LucideIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MenuOption {
  key: string;
  icon: LucideIcon;
  label: string;
  tone?: "default" | "danger";
  disabled?: boolean;
  separated?: boolean;
  onSelect: () => void;
}

interface OptionsMenuProps {
  label: string;
  trigger: ReactElement;
  options: readonly MenuOption[];
}

export function OptionsMenu({ label, trigger, options }: OptionsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={trigger} aria-label={label} />
      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="w-64 rounded-2xl border border-tertiary/30 bg-primary p-2 shadow-[0_20px_50px_-20px_rgba(6,33,18,0.28)]"
      >
        {options.map(
          ({
            key,
            icon: Icon,
            label: optionLabel,
            tone,
            disabled,
            separated,
            onSelect,
          }) => (
            <div key={key}>
              {separated && <div className="my-1.5 h-px bg-tertiary/25" />}
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setOpen(false);
                  onSelect();
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2 text-left font-sans text-sm transition-colors disabled:pointer-events-none disabled:opacity-50",
                  tone === "danger"
                    ? "text-red-700 hover:bg-red-50"
                    : "text-secondary hover:bg-quaternary/35",
                )}
              >
                <Icon className="size-4.5" strokeWidth={1.7} />
                {optionLabel}
              </button>
            </div>
          ),
        )}
      </PopoverContent>
    </Popover>
  );
}
