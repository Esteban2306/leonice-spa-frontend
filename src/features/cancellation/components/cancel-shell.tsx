import type { ReactNode } from "react";
import Image from "next/image";

import leoniceLogo from "../../../../public/leonice-logo-b.png";

export function CancelShell({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#F2EBDB] px-4 py-10 sm:py-14">
      <Image
        src={leoniceLogo}
        alt="Leonice Spa"
        priority
        className="h-auto w-28"
      />
      <div className="mt-8 w-full max-w-xl">{children}</div>
      <p className="mt-8 max-w-sm text-center font-sans text-xs text-secondary/70">
        Leonice Spa · Bogotá. Este enlace es personal; no lo compartas.
      </p>
    </main>
  );
}

export function CancelCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-tertiary/30 bg-[#FCF6EB] shadow-[0_24px_60px_-40px_rgba(6,33,18,0.45)]">
      <header className="bg-secondary px-6 pt-7 pb-6 text-primary sm:px-8">
        <h1 className="font-heading text-3xl leading-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-sans text-sm text-primary/75">{subtitle}</p>
        )}
      </header>
      <div className="flex flex-col gap-6 px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

export function WhatsAppButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-secondary px-6 font-sans text-sm font-medium text-primary transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}
