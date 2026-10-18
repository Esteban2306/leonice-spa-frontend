export type LandingIcon =
  | "lounge"
  | "leaf"
  | "drop"
  | "award"
  | "camera"
  | "scan"
  | "sparkles"
  | "hands"
  | "home";

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  icon: LandingIcon;
  image: string | null;
  imageHint: string;
}

export interface TreatmentCopy {
  summary: string;
  detail: string;
}

export interface LandingTreatment {
  id: string;
  name: string;
  slug?: string | null;
  categorySlug?: string | null;
  categoryName: string;
  durationMinutes: number;
  priceFromThousands: number;
  priceToThousands: number;
  promotion: { name: string; discountPercentage: number; priceFromThousands: number } | null;
  requiresAssessment: boolean;
  copy: TreatmentCopy;
  image: string | null;
}

export interface LandingCategory {
  id: string;
  name: string;
  slug?: string | null;
  treatmentCount: number;
  fromThousands: number | null;
  highlights: LandingTreatment[];
}

export interface LandingCatalog {
  source: "api" | "fallback";
  featured: LandingTreatment[];
  all: LandingTreatment[];
  categories: LandingCategory[];
}

export interface StoryItem {
  id: string;
  title: string;
  quote: string;
  author: string;
  treatment: string;
  before: string | null;
  after: string | null;
  sample: boolean;
}

export interface PromiseItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  imageHint: string;
  icon: LandingIcon;
  size: "feature" | "tall" | "wide" | "square";
}

export interface LandingProductVariant {
  id: string;
  brand: string;
  presentation: string;
  pricePesos: number | null;
  imageUrl: string | null;
}

export interface LandingProduct {
  id: string;
  name: string;
  slug?: string | null;
  description: string | null;
  categoryName: string | null;
  tags: string[];
  variants: LandingProductVariant[];
  image: string | null;
}

export interface MetricItem {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  sample: boolean;
}

export const heroContent = {
  title: "Recupera la fuerza y el brillo de tu cabello",
  lead: "Diagnóstico personalizado y procedimientos de grado profesional, en un espacio pensado para devolverte la confianza de llevar tu cabello como quieras.",
  primaryAction: "Agenda tu diagnóstico capilar",
  portals: [
    {
      id: "servicios",
      title: "Nuestros servicios",
      target: "tratamientos",
      tone: "dark",
      image: null,
      imageHint: "Retrato de clienta con el cabello suelto",
    },
    {
      id: "productos",
      title: "Nuevos productos",
      target: "productos",
      tone: "light",
      image: null,
      imageHint: "Productos MAIS sobre fondo claro",
    },
  ],
} as const;

export const whyContent = {
  title: "Cuidado capilar con criterio clínico y alma de spa",
  items: [
    {
      id: "confort",
      title: "Confort y elegancia",
      description:
        "Una cabina cálida y silenciosa, pensada para que desconectes mientras trabajamos tu cabello sin prisa.",
      icon: "lounge",
      image: null,
      imageHint: "Cabina del spa con luz cálida",
    },
    {
      id: "diagnostico",
      title: "Diagnóstico personalizado",
      description:
        "Antes de tocar tu cabello lo observamos: cuero cabelludo, fibra e historial. El plan nace de lo que necesitas hoy.",
      icon: "leaf",
      image: null,
      imageHint: "Microcámara revisando el cuero cabelludo",
    },
    {
      id: "productos",
      title: "Productos de grado profesional",
      description:
        "Trabajamos con líneas capilares profesionales, seleccionadas por resultado clínico, no por moda.",
      icon: "drop",
      image: null,
      imageHint: "Productos y cuencos dorados en cabina",
    },
    {
      id: "equipo",
      title: "Equipo certificado",
      description:
        "Manos formadas en terapia capilar que conocen cada técnica y te explican cada paso del proceso.",
      icon: "award",
      image: null,
      imageHint: "Equipo de Leonice en el salón",
    },
    {
      id: "resultados",
      title: "Resultados documentados",
      description:
        "Registramos tu antes y después para seguir tu evolución sesión a sesión, con fotos que tú también puedes ver.",
      icon: "camera",
      image: null,
      imageHint: "Antes y después de un tratamiento",
    },
  ] satisfies WhyItem[],
};

export const treatmentsContent = {
  title: "Procedimientos con propósito, no de catálogo",
  featuredNames: ["Terapia de hidratación", "Alisado", "Terapia anticaída", "Terapia antiácida"],
  fallbackCategory: "Spa Capilar",
  hiddenCategories: ["Fase de Prueba QA"],
  copyByName: {
    "Terapia de hidratación": {
      summary: "Restaura fibra capilar seca o dañada con activos de alta penetración.",
      detail:
        "Pensada para cabello áspero, opaco o quebradizo. En el diagnóstico te contamos cuántas sesiones necesita tu fibra.",
    },
    Alisado: {
      summary: "Disciplina el cabello y reduce el frizz sin comprometer su salud.",
      detail:
        "Antes de empezar evaluamos tu cabello para elegir la técnica y el tiempo que tu fibra puede recibir.",
    },
    "Terapia anticaída": {
      summary: "Estimula el cuero cabelludo y fortalece el folículo desde la raíz.",
      detail:
        "Empieza con una mirada al cuero cabelludo; el plan se ajusta a lo que encontramos en cada visita.",
    },
    "Terapia antiácida": {
      summary: "Estimula el cuero cabelludo y fortalece el folículo desde la raíz.",
      detail:
        "Empieza con una mirada al cuero cabelludo; el plan se ajusta a lo que encontramos en cada visita.",
    },
  } as Record<string, TreatmentCopy>,
  copyByCategory: {
    "Spa Capilar": {
      summary: "Un ritual capilar diseñado a partir de tu diagnóstico.",
      detail: "Te explicamos qué hace cada paso y cómo cuidar el resultado en casa.",
    },
    "Spa Coreano": {
      summary: "Limpieza profunda y masaje del cuero cabelludo al estilo coreano.",
      detail: "Un momento para soltar la tensión mientras tu cuero cabelludo respira.",
    },
    Uñas: {
      summary: "Manos y pies cuidados con el mismo detalle que tu cabello.",
      detail: "Elige el acabado y lo adaptamos a tu ritmo y a tus manos.",
    },
  } as Record<string, TreatmentCopy>,
  defaultCopy: {
    summary: "Un tratamiento pensado para la salud de tu cabello.",
    detail: "En tu cita te explicamos cada paso y cómo cuidar el resultado.",
  } satisfies TreatmentCopy,
};

export const fallbackCatalog: LandingCatalog = {
  source: "fallback",
  featured: [],
  all: [],
  categories: [],
};

export const storiesContent = {
  title: "Transformaciones, no reseñas de cinco estrellas",
  items: [
    {
      id: "historia-1",
      title: "Terapia anticaída",
      quote:
        "Llevaba años sin poder usar el cabello suelto por la caída. Hoy, después de la terapia, vuelvo a sentirlo mío.",
      author: "M.R.",
      treatment: "Terapia anticaída",
      before: null,
      after: null,
      sample: true,
    },
    {
      id: "historia-2",
      title: "Alisado con keratina",
      quote:
        "Probé de todo para el frizz. El alisado con keratina fue el primer resultado que se mantuvo real, no de un día.",
      author: "D.C.",
      treatment: "Alisado con keratina",
      before: null,
      after: null,
      sample: true,
    },
    {
      id: "historia-3",
      title: "Diagnóstico capilar",
      quote:
        "El diagnóstico me explicó por primera vez qué le pasaba a mi cabello. Tres meses después, la diferencia se nota sin filtro.",
      author: "M.R.",
      treatment: "Terapia anticaída",
      before: null,
      after: null,
      sample: true,
    },
  ] satisfies StoryItem[],
};

export const promiseContent = {
  title: "Nuestra promesa",
  lead: "Cuatro fundamentos sostienen cada visita a Leonice.",
  items: [
    {
      id: "diagnostico",
      title: "Diagnóstico capilar personalizado y honesto",
      description:
        "Observamos tu cuero cabelludo y tu fibra con atención. No hay fórmulas genéricas, solo un plan que nace de lo que tu cabello necesita hoy.",
      image: null,
      imageHint: "Diagnóstico con microcámara y tableta",
      icon: "scan",
      size: "feature",
    },
    {
      id: "origen",
      title: "Productos premium de origen colombiano",
      description: "Trabajamos con productos naturales y certificados de origen colombiano.",
      image: null,
      imageHint: "Mascarilla MAIS sobre piedra",
      icon: "sparkles",
      size: "square",
    },
    {
      id: "tecnicas",
      title: "Técnicas de masaje y lavado exclusivas",
      description: "Manos entrenadas en rituales europeos de spa.",
      image: null,
      imageHint: "Lavado y masaje capilar",
      icon: "hands",
      size: "square",
    },
    {
      id: "intima",
      title: "Atención íntima",
      description:
        "Un espacio privado y cálido donde el tiempo se detiene y solo importa tu bienestar.",
      image: null,
      imageHint: "Cabina privada con luz tenue",
      icon: "home",
      size: "wide",
    },
  ] satisfies PromiseItem[],
};

export const productsContent = {
  title: "Continúa tu tratamiento en casa",
  lead: "La misma línea de producto profesional que usamos en cabina, disponible para tu rutina diaria.",
};

export const metricsContent = {
  title: "La confianza se construye con resultados",
  lead: "Cada cifra es una mujer que volvió a mirarse al espejo con calma. Cada número es una promesa cumplida.",
  items: [
    {
      id: "anos",
      value: 12,
      label: "Años de experiencia",
      detail: "Años perfeccionando rituales capilares en un espacio íntimo.",
      sample: true,
    },
    {
      id: "clientas",
      value: 700,
      suffix: "+",
      label: "Clientas satisfechas",
      detail: "Mujeres que confían su cabello a nuestras manos cada mes.",
      sample: true,
    },
    {
      id: "tratamientos",
      value: 5000,
      label: "Tratamientos realizados",
      detail: "Rituales completos que transforman la salud del cabello.",
      sample: true,
    },
    {
      id: "productos",
      value: 40,
      label: "Productos en cabina",
      detail: "Botánicos premium seleccionados para cada tipo de cabello.",
      sample: true,
    },
  ] satisfies MetricItem[],
};

export const publishedStories = storiesContent.items.filter((item) => !item.sample);

export const publishedMetrics = metricsContent.items.filter((item) => !item.sample);

export const visitContent = {
  title: "Tu cabello merece un plan, no solo un producto",
  reviewTitle: "¿Nos dejas tu valoración en Google?",
};
