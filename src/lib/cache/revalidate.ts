/**
 * Cuánto tiempo se reutiliza lo que ya está en la caché antes de regenerarlo.
 *
 * Cada regeneración escribe en Cloudflare KV, que en el plan gratuito permite
 * 1.000 escrituras al día. Por eso hay dos modos, elegidos con `PUBLIC_CACHE_MODE`:
 *
 * - `economy` (por defecto): una hora. Pensado para el plan gratuito. Lo que se edita
 *   en el panel tarda hasta una hora en verse en la web pública.
 * - `fresh`: tiempos cortos (60 s los testimonios, 300 s lo demás). Los cambios se ven
 *   casi al instante, pero gasta muchas más escrituras; usar con el plan de pago.
 * - `instant`: sin caché; cada visita pide los datos de nuevo. Es el modo en desarrollo
 *   local (`next dev`) cuando no se fija la variable.
 *
 * El modo se fija al COMPILAR (next.config.ts lo inyecta en el código), así que cambiarlo
 * exige un nuevo despliegue. Las páginas no declaran `revalidate`: Next toma el menor de
 * los tiempos de los datos que cada una pide, de modo que estos valores mandan en todas.
 */
export type CacheMode = "economy" | "fresh" | "instant";

export const DEFAULT_CACHE_MODE: CacheMode = "economy";

const TTL: Record<CacheMode, { content: number; testimonials: number }> = {
  economy: { content: 3600, testimonials: 3600 },
  fresh: { content: 300, testimonials: 60 },
  instant: { content: 0, testimonials: 0 },
};

export function resolveCacheMode(raw: string | undefined, nodeEnv?: string): CacheMode {
  const value = raw?.trim().toLowerCase();
  if (value === "fresh" || value === "economy" || value === "instant") return value;
  return nodeEnv === "development" ? "instant" : DEFAULT_CACHE_MODE;
}

export const CACHE_MODE = resolveCacheMode(process.env.PUBLIC_CACHE_MODE, process.env.NODE_ENV);

/** Catálogo, tratamientos, horarios y listados de la portada. */
export const REVALIDATE_SECONDS = TTL[CACHE_MODE].content;

/** Testimonios de la portada. */
export const TESTIMONIALS_REVALIDATE_SECONDS = TTL[CACHE_MODE].testimonials;
