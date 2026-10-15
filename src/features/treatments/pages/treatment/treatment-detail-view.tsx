import type { ShowcaseTreatmentDetail } from "@/src/features/treatments/api/showcase.types";
import { BookingBand } from "@/src/features/treatments/components/booking-band";
import { CareSection } from "@/src/features/treatments/components/care-section";
import { IdealForList } from "@/src/features/treatments/components/ideal-for-list";
import { OutcomeBlock } from "@/src/features/treatments/components/outcome-block";
import { Reveal } from "@/src/features/treatments/components/reveal";
import { StepRitual } from "@/src/features/treatments/components/step-ritual";
import { StickyBookingBar } from "@/src/features/treatments/components/sticky-booking-bar";
import { TreatmentCard } from "@/src/features/treatments/components/treatment-card";
import { TreatmentHero } from "@/src/features/treatments/components/treatment-hero";
import {
  assessmentMessage,
  bookingMessage,
  durationLabel,
  priceDisplay,
} from "@/src/features/treatments/lib/showcase-format";

export function TreatmentDetailView({ treatment }: { treatment: ShowcaseTreatmentDetail }) {
  const duration = durationLabel(treatment.durationMinMinutes, treatment.durationMaxMinutes);
  const price = priceDisplay(treatment.price);
  const primaryMessage = treatment.requiresPriorAssessment
    ? assessmentMessage(treatment.name)
    : bookingMessage(treatment.name);
  const primaryLabel = "Agendar";

  return (
    <>
      <TreatmentHero treatment={treatment} />
      <IdealForList items={treatment.idealFor} />
      <StepRitual
        steps={treatment.steps}
        treatmentName={treatment.name}
        durationLabel={duration}
        bookingMessage={primaryMessage}
      />
      <OutcomeBlock
        benefits={treatment.benefits}
        results={treatment.results}
        recommendedFrequency={treatment.recommendedFrequency}
      />
      <CareSection aftercare={treatment.aftercare} considerations={treatment.considerations} />
      <BookingBand
        title={`Tu momento para ${treatment.name.toLowerCase()}`}
        lead={
          treatment.requiresPriorAssessment
            ? "Agenda tu valoración por WhatsApp: revisamos tu cabello, te confirmamos el precio y separamos tu cita."
            : "Escríbenos por WhatsApp con el horario que prefieres y te confirmamos tu cita."
        }
        message={primaryMessage}
        actionLabel={treatment.requiresPriorAssessment ? "Agendar mi valoración" : "Agendar por WhatsApp"}
        secondary={{ label: "Tengo una pregunta", message: `Hola, tengo una pregunta sobre ${treatment.name}.` }}
      />
      {treatment.related.length > 0 && (
        <section aria-labelledby="relacionados" className="px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
            <h2
              id="relacionados"
              className="font-heading text-[clamp(2rem,3.6vw,3rem)] leading-[1.05] text-balance text-[#062112]"
            >
              Más en {treatment.category.name}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 desk:grid-cols-3">
              {treatment.related.map((related, index) => (
                <Reveal as="li" key={related.id} delay={index * 90}>
                  <TreatmentCard treatment={related} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
      <StickyBookingBar
        watchId="tratamiento-portada"
        title={treatment.name}
        detail={[duration, price.label].filter(Boolean).join(" · ") || null}
        message={primaryMessage}
        actionLabel={primaryLabel}
      />
    </>
  );
}
