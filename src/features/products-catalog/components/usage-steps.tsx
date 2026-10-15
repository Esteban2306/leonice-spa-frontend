export function UsageSteps({ steps, compact = false }: { steps: string[]; compact?: boolean }) {
  if (steps.length === 0) return null;
  return (
    <ol className="relative flex flex-col">
      <span
        aria-hidden="true"
        className={`absolute bottom-4 top-4 w-px bg-[#BF9250]/40 ${compact ? "left-[0.9375rem]" : "left-[1.1875rem]"}`}
      />
      {steps.map((step, index) => (
        <li key={step} className={`relative grid grid-cols-[auto_1fr] items-start ${compact ? "gap-3 py-2" : "gap-5 py-3"}`}>
          <span
            className={`relative grid place-items-center rounded-full bg-[#062112] font-heading text-[#E0BC87] ${
              compact ? "size-8 text-base" : "size-10 text-lg"
            }`}
          >
            {index + 1}
          </span>
          <p className={`pt-1 font-sans leading-relaxed text-pretty text-[#062112]/80 ${compact ? "text-sm" : "text-base"}`}>
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}
