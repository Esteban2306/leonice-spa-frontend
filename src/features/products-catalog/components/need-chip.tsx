"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";

interface NeedChipProps {
  label: string;
  count: number;
  selected: boolean;
  onToggle: () => void;
}

export function NeedChip({ label, count, selected, onToggle }: NeedChipProps) {
  const empty = count === 0 && !selected;
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={empty}
      onClick={onToggle}
      className={`group/chip relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full border pl-4 pr-1.5 font-sans text-sm transition-[border-color,color,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250] disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? "border-[#062112] text-[#F2EBDB]"
          : "border-[#062112]/15 text-[#062112] hover:border-[#062112]/50"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-left rounded-full bg-[#062112] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          selected ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <span className="relative inline-flex items-center gap-1.5">
        <AnimatePresence initial={false}>
          {selected && (
            <motion.span
              key="check"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex overflow-hidden text-[#E0BC87]"
            >
              <Check className="size-3.5" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
        {label}
      </span>
      <span
        className={`relative grid h-7 min-w-7 place-items-center overflow-hidden rounded-full px-2 text-xs font-bold tabular-nums ${
          selected ? "bg-[#E0BC87] text-[#062112]" : "bg-[#062112]/6 text-[#7a5a2c]"
        }`}
      >
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={count}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {count}
          </motion.span>
        </AnimatePresence>
        <span className="sr-only"> productos</span>
      </span>
    </button>
  );
}
