import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";

interface ToolbarMobilePanelProps {
  activeCount: number;
  children: ReactNode;
}

export function ToolbarMobilePanel({
  activeCount,
  children,
}: ToolbarMobilePanelProps) {
  return (
    <Accordion className="rounded-2xl border border-tertiary/25 bg-white/60">
      <AccordionItem value="filters-and-schedule" className="border-none">
        <AccordionTrigger className="items-center px-4 py-3 font-sans text-sm text-secondary hover:no-underline">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" strokeWidth={1.8} />
            Filtros y agenda
            {activeCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-secondary px-1.5 font-sans text-[11px] text-primary">
                {activeCount}
              </span>
            )}
          </span>
        </AccordionTrigger>

        <AccordionContent className="px-4 pb-4">
          <div className="flex flex-col gap-4">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
