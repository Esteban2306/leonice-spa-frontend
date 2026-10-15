import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-1.5 font-sans text-sm text-[#062112]/65">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="size-3.5 text-[#BF9250]" aria-hidden="true" />}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-full underline-offset-[5px] transition-colors hover:text-[#062112] hover:underline hover:decoration-[#BF9250] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#BF9250]"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[#062112]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
