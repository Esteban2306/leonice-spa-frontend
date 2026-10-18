import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <div className="relative w-full sm:w-64">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary/70"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar cliente, teléfono o tratamiento"
        aria-label="Buscar en el calendario"
        className="h-10 w-full rounded-full border border-secondary/15 bg-white pl-9 pr-9 font-sans text-sm text-secondary outline-none placeholder:text-secondary/40 focus-visible:border-tertiary focus-visible:ring-2 focus-visible:ring-tertiary/40"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-secondary/70 hover:bg-secondary/5"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
