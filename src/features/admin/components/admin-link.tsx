import NextLink from "next/link";
import type { ComponentProps } from "react";

/**
 * Enlace del panel sin precarga.
 *
 * Next precarga cada ruta de un `<Link>` visible, y cada precarga es una petición
 * al Worker de Cloudflare. El panel tiene decenas de enlaces (menú, tablas, tarjetas),
 * así que una sola pantalla generaba muchas invocaciones que gastan CPU del plan
 * gratuito (10 ms por petición) sin que nadie las pidiera. Se navega igual; la
 * página se pide cuando la persona hace clic.
 */
export default function AdminLink({ prefetch = false, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={prefetch} {...props} />;
}
