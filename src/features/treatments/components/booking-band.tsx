import { BookingLink } from "@/src/features/landing/components/action-link";
import { Reveal } from "@/src/features/treatments/components/reveal";

interface BookingBandProps {
  title: string;
  lead: string;
  message: string;
  actionLabel: string;
  secondary?: { label: string; message: string };
}

export function BookingBand({ title, lead, message, actionLabel, secondary }: BookingBandProps) {
  return (
    <section aria-label="Agenda tu cita" className="px-5 pb-24 sm:px-8 sm:pb-32">
      <Reveal className="mx-auto max-w-[1440px]">
        <div className="lit-dark relative overflow-hidden rounded-[2rem] bg-[#062112] px-6 py-14 [--lift:18px] sm:px-14 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(224_188_135/0.22),transparent_65%)]"
          />
          <div className="relative flex flex-col gap-10 desk:flex-row desk:items-end desk:justify-between">
            <div className="flex max-w-2xl flex-col gap-5">
              <h2 className="font-heading text-[clamp(2.25rem,4.6vw,4rem)] leading-[1.02] tracking-[-0.01em] text-balance text-[#F2EBDB]">
                {title}
              </h2>
              <p className="max-w-[52ch] font-sans text-lg leading-relaxed text-pretty text-[#F2EBDB]/75">{lead}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <BookingLink variant="sand" size="lg" message={message}>
                {actionLabel}
              </BookingLink>
              {secondary && (
                <BookingLink variant="outline-cream" size="lg" arrow={false} message={secondary.message}>
                  {secondary.label}
                </BookingLink>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
