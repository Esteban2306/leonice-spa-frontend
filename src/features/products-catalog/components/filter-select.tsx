"use client";

import { ChevronDown } from "lucide-react";

interface FilterSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className = "",
}: FilterSelectProps) {
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      className={`group/select relative inline-flex h-10 w-32 items-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="invisible whitespace-pre pl-4 pr-9 font-sans text-sm font-bold"
      >
        {selected?.label}
      </span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-[#062112]/15 bg-white/70 pl-4 pr-9 font-sans text-sm font-bold text-[#062112] transition-[border-color,box-shadow] duration-300 hover:border-[#062112]/40 focus:border-[#BF9250] focus:shadow-[0_0_0_4px_rgb(191_146_80/0.18)] focus:outline-none"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 size-4 text-[#7a5a2c] transition-transform duration-300 group-focus-within/select:translate-y-px"
      />
    </div>
  );
}
