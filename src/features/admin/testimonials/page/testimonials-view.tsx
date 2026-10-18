import type { ReactNode } from "react";
import { Plus } from "lucide-react";

import type { AdminTestimonial } from "@/src/features/admin/types/testimonials.types";

import {
  TestimonialCard,
  type TestimonialCardHandlers,
} from "../components/testimonial-card";
import { countMissingPhotos } from "../lib/testimonial-form";

export interface TestimonialsViewProps {
  testimonials: readonly AdminTestimonial[];
  isLoading: boolean;
  isError: boolean;
  busyIds: ReadonlySet<string>;
  isReordering: boolean;
  handlers: TestimonialCardHandlers;
  onCreate: () => void;
  onRetry: () => void;
}

const PRIMARY_BUTTON =
  "inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-secondary px-6 font-sans text-sm text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[1.25rem] border border-tertiary/30 bg-[#FCF6EB] px-4 py-3">
      <p className="font-sans text-3xl font-bold text-secondary tabular-nums">
        {value}
      </p>
      <p className="font-sans text-xs text-secondary/75">{label}</p>
    </div>
  );
}

export function TestimonialsView(props: TestimonialsViewProps) {
  const total = props.testimonials.length;
  const published = props.testimonials.filter(
    (item) => item.isPublished,
  ).length;
  const showsSamples = !props.isLoading && !props.isError && published === 0;

  let content: ReactNode;
  if (props.isLoading && total === 0) {
    content = (
      <div
        role="status"
        aria-label="Cargando testimonios"
        className="flex flex-col gap-3"
      >
        {[0, 1, 2].map((key) => (
          <div
            key={key}
            className="h-40 animate-pulse rounded-[1.5rem] bg-secondary/8"
          />
        ))}
      </div>
    );
  } else if (total === 0 && !props.isError) {
    content = (
      <div className="flex flex-col items-center gap-3 rounded-[2rem] border border-dashed border-tertiary/50 px-6 py-12 text-center">
        <p className="font-heading text-2xl text-secondary">
          Aún no hay testimonios
        </p>
        <p className="max-w-md font-sans text-sm text-secondary/75">
          Agrega el primero con la frase de la clienta y sus fotos de antes y
          después. Mientras tanto, la web muestra historias de ejemplo.
        </p>
        <button
          type="button"
          onClick={props.onCreate}
          className={PRIMARY_BUTTON}
        >
          <Plus className="size-4" strokeWidth={2} />
          Nuevo testimonio
        </button>
      </div>
    );
  } else {
    content = (
      <ul className="flex flex-col gap-3">
        {props.testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            isFirst={index === 0}
            isLast={index === total - 1}
            isBusy={props.busyIds.has(testimonial.id) || props.isReordering}
            {...props.handlers}
          />
        ))}
      </ul>
    );
  }

  return (
    <main className="min-h-full bg-primary">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 p-5 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-5 rounded-[2rem] bg-secondary p-6 text-primary sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-heading text-4xl sm:text-5xl">Testimonios</h1>
            <p className="mt-2 max-w-xl font-sans text-sm text-primary/70">
              Las historias con antes y después que se muestran en la web. El
              orden de esta lista es el orden del carrusel.
            </p>
          </div>
          <button
            type="button"
            onClick={props.onCreate}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-tertiary px-5 font-sans text-sm font-semibold text-secondary transition-colors hover:bg-quaternary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quaternary"
          >
            <Plus className="size-4" strokeWidth={2} />
            Nuevo testimonio
          </button>
        </header>

        {!props.isLoading && !props.isError && (
          <div className="grid grid-cols-3 gap-3">
            <Stat value={total} label="Testimonios" />
            <Stat value={published} label="Publicados" />
            <Stat
              value={countMissingPhotos(props.testimonials)}
              label="Con fotos por completar"
            />
          </div>
        )}

        {showsSamples && total > 0 && (
          <p
            role="status"
            className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900"
          >
            Ningún testimonio está publicado, así que la web muestra las
            historias de ejemplo. Publica uno para reemplazarlas.
          </p>
        )}

        {props.isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-800"
          >
            No se pudieron cargar los testimonios.
            <button
              type="button"
              onClick={props.onRetry}
              className="cursor-pointer rounded-full bg-red-700 px-4 py-1.5 text-white"
            >
              Reintentar
            </button>
          </div>
        )}

        {content}
      </div>
    </main>
  );
}
