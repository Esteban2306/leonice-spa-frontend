import { cn } from "@/lib/utils";

import type { StatusTone } from "../lib/whatsapp-format";

const TONES: Record<StatusTone, string> = {
  green: "border-green-300 bg-green-50 text-green-800",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  gray: "border-secondary/15 bg-white text-secondary/75",
  red: "border-red-300 bg-red-50 text-red-800",
};

const DOTS: Record<StatusTone, string> = {
  green: "bg-green-600",
  amber: "bg-amber-500",
  gray: "bg-secondary/40",
  red: "bg-red-600",
};

export function StatusPill({
  tone,
  children,
  pulse,
  size = "sm",
}: {
  tone: StatusTone;
  children: React.ReactNode;
  pulse?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-sans whitespace-nowrap",
        size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-[11px]",
        TONES[tone],
      )}
    >
      <span className="relative flex size-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:animate-none",
              DOTS[tone],
            )}
          />
        )}
        <span
          className={cn("relative inline-flex size-2 rounded-full", DOTS[tone])}
        />
      </span>
      {children}
    </span>
  );
}
