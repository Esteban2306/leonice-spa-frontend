import { House, Info } from "lucide-react";

import { Reveal } from "@/src/features/treatments/components/reveal";

export function CareSection({ aftercare, considerations }: { aftercare: string[]; considerations: string[] }) {
  if (aftercare.length === 0 && considerations.length === 0) return null;
  return (
    <section aria-labelledby="cuidados" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto grid max-w-[1440px] gap-6 desk:grid-cols-[1.2fr_0.8fr]">
        {aftercare.length > 0 && (
          <Reveal className="lit flex flex-col gap-6 rounded-[2rem] bg-[#FDF8F1] p-7 [--lift:12px] sm:p-10">
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-[#E0BC87]/40 text-[#062112]">
                <House className="size-5" strokeWidth={1.4} aria-hidden="true" />
              </span>
              <h2 id="cuidados" className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] text-[#062112]">
                Para que dure en casa
              </h2>
            </div>
            <ul className="flex flex-col gap-4">
              {aftercare.map((item) => (
                <li key={item} className="grid grid-cols-[auto_1fr] items-baseline gap-4 font-sans text-base leading-relaxed text-[#062112]/80">
                  <span aria-hidden="true" className="size-1.5 translate-y-[-0.15em] rounded-full bg-[#BF9250]" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {considerations.length > 0 && (
          <Reveal delay={90} className="flex flex-col gap-5 rounded-[2rem] border border-dashed border-[#BF9250]/60 p-7 sm:p-10">
            <div className="flex items-center gap-3">
              <Info className="size-5 text-[#BF9250]" aria-hidden="true" />
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5a2c]">Antes de agendar</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {considerations.map((item) => (
                <li key={item} className="font-sans text-base leading-relaxed text-pretty text-[#062112]/80">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
