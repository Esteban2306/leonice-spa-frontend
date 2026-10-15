export const SPA_NAME = "Leonice Arenas Spa Capilar";

export const SECTION_IDS = {
  home: "inicio",
  why: "por-que-leonice",
  treatments: "tratamientos",
  stories: "historias",
  promise: "promesa",
  products: "productos",
  metrics: "resultados",
  contact: "contacto",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const OPENING_HOURS = [
  { days: "Lun – Vie", hours: "8:00 am – 6:00 pm", sample: true },
  { days: "Sáb", hours: "8:00 am – 7:00 pm", sample: true },
] as const;

export const siteContact = {
  whatsappDigits: "573144518129",
  address: "Carrera 9 # 13A - 17, Granada, Meta",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.197628181269!2d-73.70167820000002!3d3.5418277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3de3001cce8af1%3A0xe5a43497196bb4e0!2sSpa%20capilar%20Leonice%20Arenas!5e0!3m2!1ses!2sco!4v1791941118692!5m2!1ses!2sco",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Spa+capilar+Leonice+Arenas",
  googleReviewUrl: "https://g.page/r/CeC0axmXNKTlECE/review",
};

export function whatsappHref(message: string): string | null {
  if (!siteContact.whatsappDigits) return null;
  return `https://wa.me/${siteContact.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function formatWhatsappDisplay(): string | null {
  const value = siteContact.whatsappDigits;
  if (!value) return null;
  if (value.length === 12 && value.startsWith("57")) {
    return `+57 ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8)}`;
  }
  return `+${value}`;
}

export const BOOKING_MESSAGE = "Hola, quiero agendar una cita en Leonice.";
