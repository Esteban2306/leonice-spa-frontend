"use client";

import { useRef } from "react";

import { BookingLink } from "@/src/features/landing/components/action-link";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import {
  productsContent,
  type LandingProduct,
} from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { ProductCard } from "@/src/features/landing/sections/products/product-card";

export function ProductsSection({
  products = productsContent.items,
}: {
  products?: LandingProduct[];
}) {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const gsap = ensureGsap();
    const mm = gsap.matchMedia();

    mm.add(
      MOTION_OK,
      () => {
        const heading = root.querySelector<HTMLElement>("[data-heading]");
        const split = heading ? SplitText.create(heading, { type: "words", mask: "words" }) : null;
        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            scrollTrigger: { trigger: root, start: "top 70%", once: true },
          })
          .from(split?.words ?? [], { yPercent: 105, duration: 1, stagger: 0.05 })
          .from("[data-lead]", { opacity: 0, y: 14, duration: 0.9 }, 0.25)
          .from(
            "[data-shelf] > li",
            {
              y: 70,
              rotateX: -18,
              opacity: 0,
              transformPerspective: 900,
              transformOrigin: "50% 100%",
              duration: 1.3,
              stagger: 0.1,
            },
            0.3,
          );
        return () => split?.revert();
      },
      root,
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={SECTION_IDS.products}
      tabIndex={-1}
      aria-labelledby="products-title"
      className="relative bg-[#F2EBDB] py-24 outline-none sm:py-32"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col gap-14 px-5 sm:px-8">
        <SectionHeading
          id="products-title"
          title={productsContent.title}
          lead={productsContent.lead}
          action={
            <BookingLink
              variant="sand"
              message="Hola, quiero conocer los productos que venden en Leonice."
            >
              Explorar todos los productos
            </BookingLink>
          }
        />
        <ul
          data-shelf
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 desk:grid-cols-4"
        >
          {products.map((product) => (
            <li key={product.id} className="w-[72vw] max-w-[18rem] shrink-0 snap-center sm:w-auto sm:max-w-none">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
