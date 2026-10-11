"use client";

import { useRef } from "react";

import { ActionLink, BookingLink } from "@/src/features/landing/components/action-link";
import { metricsContent, type MetricItem } from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { useSurfaceGlow } from "@/src/features/landing/motion/use-surface-glow";

const number = new Intl.NumberFormat("es-CO");

function formatMetric(value: number) {
  return value >= 1000 && value % 1000 === 0 ? `${value / 1000}K` : number.format(value);
}

function MetricPanel({ metric }: { metric: MetricItem }) {
  const glowRef = useSurfaceGlow<HTMLElement>();
  return (
    <article
      ref={glowRef}
      data-metric
      className="glow lit lit-hover flex flex-col justify-between gap-8 rounded-[1.75rem] border border-[#062112]/15 bg-[#FDF8F1] p-6"
    >
      <h3 className="font-sans text-sm font-bold text-[#062112]">{metric.label}</h3>
      <p className="self-end font-sans text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none text-[#062112] tabular-nums">
        {metric.prefix}
        <span data-count={metric.value}>{formatMetric(metric.value)}</span>
        {metric.suffix && <span className="text-[#BF9250]">{metric.suffix}</span>}
      </p>
      <div className="flex flex-col gap-3">
        <span data-metric-rule aria-hidden="true" className="h-px w-full origin-left bg-[#062112]/60" />
        <p className="text-right font-sans text-sm leading-snug text-[#062112]/70">{metric.detail}</p>
      </div>
    </article>
  );
}

export function MetricsSection() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const heading = root.querySelector<HTMLElement>("[data-heading]");
        const split = heading ? SplitText.create(heading, { type: "lines", mask: "lines" }) : null;
        const tl = gsap.timeline({
          defaults: { ease: EASE_OUT },
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        });
        tl.from(split?.lines ?? [], { yPercent: 105, duration: 1.1, stagger: 0.1 })
          .from("[data-metrics-copy] > *", { opacity: 0, y: 16, duration: 0.9, stagger: 0.1 }, 0.3)
          .from("[data-metric]", { opacity: 0, y: 30, duration: 1.1, stagger: 0.1 }, 0.2)
          .from("[data-metric-rule]", { scaleX: 0, duration: 1.2, stagger: 0.1 }, 0.5);

        root.querySelectorAll<HTMLElement>("[data-count]").forEach((node, index) => {
          const target = Number(node.dataset.count);
          const counter = { value: 0 };
          tl.to(
            counter,
            {
              value: target,
              duration: 1.8,
              ease: "power3.out",
              onUpdate: () => {
                node.textContent = formatMetric(
                  target >= 1000 ? Math.round(counter.value / 100) * 100 : Math.round(counter.value),
                );
              },
              onComplete: () => {
                node.textContent = formatMetric(target);
              },
            },
            0.4 + index * 0.1,
          );
        });
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.metrics}
      tabIndex={-1}
      aria-labelledby="metrics-title"
      className="relative bg-[#FDF8F1] py-24 outline-none sm:py-32"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 desk:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-6">
          <h2
            id="metrics-title"
            data-heading
            className="sunlit-text font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] text-balance text-[#062112]"
          >
            {metricsContent.title}
          </h2>
          <div data-metrics-copy className="flex flex-col gap-8">
            <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-[#062112]/70">
              {metricsContent.lead}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <BookingLink variant="ink" arrow={false}>
                Reservar
              </BookingLink>
              <ActionLink variant="link" to={SECTION_IDS.treatments}>
                Ver tratamientos
              </ActionLink>
            </div>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {metricsContent.items.map((metric) => (
            <MetricPanel key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
