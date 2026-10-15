import { Sparkle } from "lucide-react";

import { Reveal } from "@/src/features/treatments/components/reveal";

interface OutcomeBlockProps {
  benefits: string[];
  results: string | null;
  recommendedFrequency: string | null;
}

export function OutcomeBlock({ benefits, results, recommendedFrequency }: OutcomeBlockProps) {
  if (benefits.length === 0 && !results) return null;
  return (
    <section aria-labelledby="resultados" className="px-5 py-24 sm:px-8 sm:py-32">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="lit-dark grid gap-12 overflow-hidden rounded-[2rem] bg-[#062112] p-7 [--lift:18px] sm:p-12 desk:grid-cols-[1.1fr_0.9fr] desk:gap-16 desk:p-16">
          <div className="flex flex-col gap-8">
            <h2
              id="resultados"
              className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#F2EBDB]"
            >
              Lo que vas a notar
            </h2>
            {benefits.length > 0 && (
              <ul className="flex flex-col gap-5">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-4">
                    <Sparkle className="mt-2 size-5 shrink-0 text-[#E0BC87]" strokeWidth={1.4} aria-hidden="true" />
                    <span className="font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.2] text-[#F2EBDB]">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col justify-end gap-8 desk:border-l desk:border-[#E0BC87]/20 desk:pl-16">
            {results && (
              <div className="flex flex-col gap-3">
                <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87]">
                  Cómo sales
                </h3>
                <p className="font-sans text-lg leading-relaxed text-pretty text-[#F2EBDB]/80">{results}</p>
              </div>
            )}
            {recommendedFrequency && (
              <div className="flex flex-col gap-3">
                <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0BC87]">
                  Frecuencia
                </h3>
                <p className="font-sans text-[0.95rem] leading-relaxed text-pretty text-[#F2EBDB]/70">
                  {recommendedFrequency}
                </p>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
