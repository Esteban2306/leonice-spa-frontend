export function SkipLink({ target = "contenido" }: { target?: string }) {
  return (
    <a
      href={`#${target}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[#062112] focus:px-5 focus:py-3 focus:font-sans focus:text-sm focus:font-bold focus:text-[#F2EBDB] focus:outline-2 focus:outline-offset-2 focus:outline-[#E0BC87]"
    >
      Saltar al contenido
    </a>
  );
}
