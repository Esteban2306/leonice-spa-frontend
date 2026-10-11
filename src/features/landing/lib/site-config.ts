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
  { days: "Lun – Vie", hours: "9:00 – 19:00", sample: true },
  { days: "Sáb", hours: "9:00 – 15:00", sample: true },
] as const;

const digits = (value: string | undefined) => (value ?? "").replace(/\D/g, "");

export const siteContact = {
  whatsappDigits: digits(process.env.NEXT_PUBLIC_SPA_WHATSAPP),
  address: process.env.NEXT_PUBLIC_SPA_ADDRESS?.trim() || null,
  mapEmbedUrl: process.env.NEXT_PUBLIC_SPA_MAP_EMBED_URL?.trim() || null,
  mapsUrl: process.env.NEXT_PUBLIC_SPA_MAPS_URL?.trim() || null,
  googleReviewUrl: process.env.NEXT_PUBLIC_SPA_GOOGLE_REVIEW_URL?.trim() || null,
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
