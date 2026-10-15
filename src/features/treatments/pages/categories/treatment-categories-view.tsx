import type { ShowcaseCategorySummary } from "@/src/features/treatments/api/showcase.types";
import { BookingBand } from "@/src/features/landing/components/booking-band";
import { Breadcrumbs } from "@/src/features/landing/components/breadcrumbs";
import { CategoryIndexRow } from "@/src/features/treatments/components/category-index-row";
import { Reveal } from "@/src/features/landing/components/reveal";
import { bookingMessage } from "@/src/features/treatments/lib/showcase-format";

export function TreatmentCategoriesView({ categories }: { categories: ShowcaseCategorySummary[] }) {
  const total = categories.reduce((sum, category) => sum + category.treatmentCount, 0);

  return (
    <>
      <header className="px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Tratamientos" }]} />
          <div className="grid gap-8 desk:grid-cols-[1.2fr_0.8fr] desk:items-end">
            <h1 className="sunlit-text font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.98] tracking-[-0.015em] text-balance text-[#062112]">
              Elige por dónde empieza tu cuidado
            </h1>
            <p className="max-w-[46ch] font-sans text-lg leading-relaxed text-pretty text-[#062112]/70">
              {total > 0
                ? `${total} servicios organizados en ${categories.length} ${categories.length === 1 ? "categoría" : "categorías"}. Entra a la que te llame y conoce cada tratamiento paso a paso, con lo que vas a sentir y cómo vas a salir.`
                : "Muy pronto encontrarás aquí todos nuestros servicios."}
            </p>
          </div>
        </div>
      </header>

      <section aria-label="Categorías de tratamientos" className="px-5 pb-24 sm:px-8 sm:pb-32">
        <ol className="mx-auto flex max-w-[1440px] flex-col gap-5">
          {categories.map((category, index) => (
            <Reveal as="li" key={category.id} delay={index * 90}>
              <CategoryIndexRow category={category} featured={index === 0} />
            </Reveal>
          ))}
        </ol>
      </section>

      <BookingBand
        title="¿No sabes cuál necesitas?"
        lead="Empieza con un diagnóstico capilar. Revisamos tu cuero cabelludo y tu cabello y te recomendamos el tratamiento que de verdad le hace falta."
        message="Hola, quiero agendar un diagnóstico capilar en Leonice."
        actionLabel="Agenda tu diagnóstico"
        secondary={{ label: "Escríbenos", message: bookingMessage() }}
      />
    </>
  );
}
