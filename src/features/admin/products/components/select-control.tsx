import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { INPUT_CLASS } from "@/src/features/admin/components/reservation-actions/form-controls";

export function SelectControl({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className={cn(
          INPUT_CLASS,
          "cursor-pointer appearance-none pr-10",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-secondary/50"
      />
    </div>
  );
}
