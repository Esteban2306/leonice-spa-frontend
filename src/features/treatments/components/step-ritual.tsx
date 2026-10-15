"use client";

import { useEffect, useRef, useState } from "react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import type { ShowcaseStep } from "@/src/features/treatments/api/showcase.types";
import { RITUAL_ID } from "@/src/features/treatments/lib/showcase-routes";
import { formatDuration } from "@/src/features/landing/lib/format";

interface StepRitualProps {
  steps: ShowcaseStep[];
  treatmentName: string;
  durationLabel: string | null;
  bookingMessage: string;
}

export function StepRitual({ steps, treatmentName, durationLabel, bookingMessage }: StepRitualProps) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter((node): node is HTMLLIElement => node !== null);
    if (nodes.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset.index));
        if (visible.length > 0) setActive(Math.max(...visible));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  if (steps.length === 0) return null;
  const progress = steps.length > 1 ? active / (steps.length - 1) : 1;

  return (
    <section
      id={RITUAL_ID}
      aria-labelledby="ritual-titulo"
      className="scroll-mt-28 bg-[#F2EBDB] px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] gap-14 desk:grid-cols-[0.85fr_1.15fr] desk:gap-20">
        <div className="flex flex-col gap-6 desk:sticky desk:top-32 desk:self-start">
          <h2
            id="ritual-titulo"
            className="sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#062112]"
          >
            El ritual, paso a paso
          </h2>
          <p className="max-w-[44ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/70">
            {treatmentName} en {steps.length} {steps.length === 1 ? "paso" : "pasos"}
            {durationLabel ? `, ${durationLabel} en total` : ""}. Cada uno tiene un propósito y en todos te contamos
            lo que estamos haciendo.
          </p>
          <div className="hidden desk:block">
            <BookingLink variant="ink" size="md" message={bookingMessage}>
              Quiero vivirlo
            </BookingLink>
          </div>
        </div>

        <ol className="relative flex flex-col">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[1.6875rem] top-8 w-px bg-[#BF9250]/30 sm:left-[2.1875rem]"
          />
          <span
            aria-hidden="true"
            className="absolute left-[1.6875rem] top-8 w-px origin-top bg-[#BF9250] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-[2.1875rem]"
            style={{ height: "calc(100% - 4rem)", transform: `scaleY(${progress})` }}
          />
          {steps.map((step, index) => {
            const lit = index <= active;
            const current = index === active;
            return (
              <li
                key={step.position}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                data-index={index}
                className="relative grid grid-cols-[auto_1fr] gap-6 py-6 sm:gap-8"
              >
                <span
                  className={`relative z-[1] grid size-14 place-items-center rounded-full font-heading text-2xl transition-[background-color,color,box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-[4.375rem] sm:text-3xl ${
                    lit
                      ? "bg-[#062112] text-[#E0BC87] shadow-[calc(var(--sun-dx)*6px)_calc(var(--sun-dy)*6px)_18px_-6px_rgb(6_33_18/0.45)]"
                      : "bg-[#FDF8F1] text-[#7a5a2c]"
                  } ${current ? "scale-105" : ""}`}
                >
                  {index + 1}
                </span>
                <div
                  className={`flex flex-col gap-2 rounded-[1.5rem] p-5 transition-[background-color,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:p-6 ${
                    current ? "lit bg-[#FDF8F1] [--lift:14px]" : lit ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <h3 className="font-sans text-xl font-bold leading-snug text-[#062112]">{step.title}</h3>
                  <p className="max-w-[58ch] font-sans text-[0.95rem] leading-relaxed text-pretty text-[#062112]/72">
                    {step.description}
                  </p>
                  {step.durationMinutes !== null && (
                    <p className="font-sans text-xs font-bold tabular-nums text-[#7a5a2c]">
                      {formatDuration(step.durationMinutes)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
