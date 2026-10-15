"use client";

import { useRef } from "react";

import { Carousel, CarouselContent, CarouselItem } from "@/src/components/ui/carousel";
import { ActionLink } from "@/src/features/landing/components/action-link";
import { PRODUCTS_PAGE } from "@/src/features/landing/lib/catalog-links";
import { SectionHeading } from "@/src/features/landing/components/section-heading";
import { productsContent, type LandingProduct } from "@/src/features/landing/content/landing-content";
import { SECTION_IDS } from "@/src/features/landing/lib/site-config";
import {
  EASE_OUT,
  ensureGsap,
  MOTION_OK,
  SplitText,
  useIsomorphicLayoutEffect,
} from "@/src/features/landing/motion/gsap";
import { useMediaQuery } from "@/src/features/landing/motion/use-media-query";
import { ProductCard } from "@/src/features/landing/sections/products/product-card";
import { ProductCarouselFooter } from "@/src/features/landing/sections/products/product-carousel-footer";
import { SectionAtmosphere } from "@/src/features/landing/components/section-atmosphere";

const OPTIONS = {
  align: "start",
  containScroll: "trimSnaps",
  slidesToScroll: 1,
  duration: 28,
} as const;

export function ProductsSection({
  products = productsContent.items,
}: {
  products?: LandingProduct[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const compact = useMediaQuery("(max-width: 640px)");
  const short = useMediaQuery("(max-height: 820px)");
  const dense = compact || short;

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
        const viewport = root.querySelector<HTMLElement>("[data-slot='carousel-content']");
        const viewRect = viewport?.getBoundingClientRect();
        const bodies = Array.from(root.querySelectorAll<HTMLElement>("[data-product-body]"))
          .filter((body) => {
            if (!viewRect) return true;
            const rect = body.getBoundingClientRect();
            return rect.right > viewRect.left + 1 && rect.left < viewRect.right - 1;
          })
          .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
        gsap.set(bodies, { opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: EASE_OUT },
            scrollTrigger: { trigger: root, start: "top 70%" },
          })
          .from(split?.words ?? [], { yPercent: 105, duration: 1, stagger: 0.05 })
          .from("[data-lead]", { opacity: 0, y: 14, duration: 0.9 }, 0.25)
          .fromTo(
            bodies,
            { opacity: 0, x: -44 },
            {
              opacity: 1,
              x: 0,
              duration: 0.95,
              stagger: 0.14,
              ease: "power3.out",
              clearProps: "opacity,transform",
            },
            0.45,
          )
          .from("[data-products-footer]", { opacity: 0, y: 10, duration: 0.8 }, 1.1);

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
      className="relative isolate overflow-hidden bg-[#F2EBDB] py-14 outline-none sm:py-8"
    >
      <SectionAtmosphere name="products" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8">
        <SectionHeading
          id="products-title"
          title={productsContent.title}
          lead={productsContent.lead}
          action={
            <ActionLink variant="sand" href={PRODUCTS_PAGE}>
              Explorar todos los productos
            </ActionLink>
          }
        />
        <Carousel opts={OPTIONS} aria-label="Productos para tu rutina en casa" className="flex flex-col gap-4">
          <CarouselContent className="-ml-5">
            {products.map((product, index) => (
              <CarouselItem
                key={product.id}
                aria-label={`${index + 1} de ${products.length}`}
                className="basis-[78%] pl-5 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div data-product-body className={compact ? "h-[32rem]" : "h-[27.5rem]"}>
                  <ProductCard product={product} dense={dense} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div data-products-footer>
            <ProductCarouselFooter />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
