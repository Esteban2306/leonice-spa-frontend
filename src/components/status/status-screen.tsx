import type { ReactNode } from "react";
import Image from "next/image";

import leoniceLogo from "../../../public/leonice-logo-b.png";

export const STATUS_PRIMARY_ACTION =
  "inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-[#062112] px-6 font-sans text-[0.95rem] font-bold text-[#F2EBDB] transition-colors hover:bg-[#0d3320] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062112]";

export const STATUS_SECONDARY_ACTION =
  "inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-[#062112]/70 px-6 font-sans text-[0.95rem] font-bold text-[#062112] transition-colors hover:bg-[#062112] hover:text-[#F2EBDB] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062112]";

export function StatusScreen({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main
      id="contenido"
      className="flex min-h-svh flex-col items-center justify-center bg-[#FDF8F1] px-5 py-16 text-center text-[#062112]"
    >
      <Image src={leoniceLogo} alt="Leonice Arenas Spa Capilar" className="h-auto w-28" priority />
      <p className="mt-10 font-sans text-sm font-bold uppercase tracking-[0.16em] text-[#062112]/80">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-[22ch] font-heading text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-[46ch] font-sans text-base leading-relaxed text-[#062112]/80">
        {description}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">{children}</div>
    </main>
  );
}
