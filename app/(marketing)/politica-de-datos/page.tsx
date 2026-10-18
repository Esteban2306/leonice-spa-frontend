import type { Metadata } from "next";

import { MarketingShell } from "@/src/features/landing/components/marketing-shell";
import { pageMetadata } from "@/src/features/landing/lib/seo";
import {
  DATA_POLICY_PATH,
  DATA_POLICY_REVIEWED,
  dataPolicySections,
} from "@/src/features/legal/data-policy";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Política de tratamiento de datos personales",
    description:
      "Cómo Leonice Arenas Spa Capilar recolecta, usa y protege tus datos personales, y cómo ejercer tus derechos según la Ley 1581 de 2012.",
    path: DATA_POLICY_PATH,
  }),
  robots: DATA_POLICY_REVIEWED ? undefined : { index: false, follow: true },
};

export default function DataPolicyPage() {
  return (
    <MarketingShell>
      <article className="mx-auto flex max-w-3xl flex-col gap-10 px-5 pb-24 text-[#062112] sm:px-8">
        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
            Política de tratamiento de datos personales
          </h1>
          {!DATA_POLICY_REVIEWED && (
            <p
              role="note"
              className="rounded-2xl border border-[#BF9250]/50 bg-[#E0BC87]/25 p-4 font-sans text-sm leading-relaxed"
            >
              Borrador pendiente de revisión legal. El contenido puede cambiar antes de su versión
              definitiva.
            </p>
          )}
        </header>
        {dataPolicySections.map((section) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`} className="flex flex-col gap-3">
            <h2 id={`${section.id}-titulo`} className="font-heading text-2xl">
              {section.title}
            </h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="font-sans text-base leading-relaxed text-[#062112]/85">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="flex list-disc flex-col gap-2 pl-5 font-sans text-base leading-relaxed text-[#062112]/85">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </MarketingShell>
  );
}
