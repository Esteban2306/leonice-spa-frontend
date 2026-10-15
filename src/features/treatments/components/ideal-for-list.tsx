import { Reveal } from "@/src/features/treatments/components/reveal";

export function IdealForList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="para-quien" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto grid max-w-[1440px] gap-10 desk:grid-cols-[0.8fr_1.2fr] desk:gap-16">
        <Reveal>
          <h2
            id="para-quien"
            className="sunlit-text font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#062112]"
          >
            Es para ti si…
          </h2>
        </Reveal>
        <ul className="flex flex-col">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item}
              delay={index * 80}
              className="flex items-baseline gap-5 border-b border-[#BF9250]/30 py-5 first:border-t"
            >
              <span aria-hidden="true" className="size-2 shrink-0 translate-y-[-0.2em] rounded-full bg-[#BF9250]" />
              <span className="font-heading text-[clamp(1.5rem,2.4vw,2.125rem)] leading-[1.2] text-[#062112]">
                {item}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
