interface DayCellDotsProps {
  total: number;
  isSelected: boolean;
}

const MAX_DOTS = 3;

export function DayCellDots({ total, isSelected }: DayCellDotsProps) {
  if (total === 0) {
    return <span aria-hidden="true" className="h-1.5 md:hidden" />;
  }

  const dots = Math.min(total, MAX_DOTS);
  const extra = total - MAX_DOTS;

  return (
    <span
      aria-hidden="true"
      className="flex h-1.5 items-center gap-0.5 md:hidden"
    >
      {Array.from({ length: dots }, (_, index) => (
        <span
          key={index}
          className={`size-1.5 rounded-full ${
            isSelected ? "bg-quaternary" : "bg-tertiary"
          }`}
        />
      ))}

      {extra > 0 && (
        <span className="ml-0.5 font-sans text-[9px] leading-none">
          +{extra}
        </span>
      )}
    </span>
  );
}
