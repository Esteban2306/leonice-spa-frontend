import { FileClock } from "lucide-react";

export function ReviewPendingChip() {
  return (
    <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-[#BF9250]/60 px-3 py-1 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">
      <FileClock className="size-3.5" aria-hidden="true" />
      Descripción en revisión
    </p>
  );
}
