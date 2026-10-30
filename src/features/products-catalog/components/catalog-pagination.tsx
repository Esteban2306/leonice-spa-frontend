"use client";

import type { MouseEvent } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { pageWindow } from "@/src/features/products-catalog/lib/catalog-pagination";

interface CatalogPaginationProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  onPageChange: (page: number) => void;
}

const LINK_BASE =
  "h-10 min-w-10 rounded-full border border-transparent px-3 font-sans text-sm font-bold tabular-nums text-[#062112] transition-[border-color,background-color,color] duration-300 hover:bg-[#062112]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF9250]";
const LINK_ACTIVE =
  "border-[#062112] bg-[#062112] text-[#F2EBDB] hover:bg-[#062112]";
const LINK_DISABLED = "pointer-events-none opacity-35";

export function CatalogPagination({
  page,
  pageCount,
  hrefFor,
  onPageChange,
}: CatalogPaginationProps) {
  if (pageCount <= 1) return null;

  const go = (target: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return;
    event.preventDefault();
    if (target !== page) onPageChange(target);
  };

  return (
    <Pagination aria-label="Páginas de la carta" className="mt-12">
      <PaginationContent className="flex-wrap justify-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            href={hrefFor(page - 1)}
            text="Anterior"
            aria-label="Página anterior"
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : undefined}
            onClick={go(page - 1)}
            className={`${LINK_BASE} ${page === 1 ? LINK_DISABLED : ""}`}
          />
        </PaginationItem>
        {pageWindow(page, pageCount).map((entry, index) =>
          entry === "gap" ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis className="text-[#7a5a2c]" />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink
                href={hrefFor(entry)}
                isActive={entry === page}
                aria-label={`Página ${entry}`}
                onClick={go(entry)}
                className={`${LINK_BASE} ${entry === page ? LINK_ACTIVE : ""}`}
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={hrefFor(page + 1)}
            text="Siguiente"
            aria-label="Página siguiente"
            aria-disabled={page === pageCount}
            tabIndex={page === pageCount ? -1 : undefined}
            onClick={go(page + 1)}
            className={`${LINK_BASE} ${page === pageCount ? LINK_DISABLED : ""}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
