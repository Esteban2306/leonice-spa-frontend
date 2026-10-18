import { useId } from "react";
import type { InputHTMLAttributes } from "react";

import { Input } from "@/src/components/ui/input";

interface FloatingLabelInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder"
> {
  label: string;
  placeholder?: string;
  error?: string;
}

export function InputFloatingLabel({
  label,
  id,
  className,
  placeholder = " ",
  error,
  ...props
}: FloatingLabelInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      <div className="group relative w-full">
        <label
          htmlFor={inputId}
          className="font-sans origin-start text-[#062112]/75 group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
        >
          <span className="inline-flex bg-transparent px-1">{label}</span>
        </label>

        <Input
          id={inputId}
          placeholder={placeholder}
          className={className}
          {...props}
        />
      </div>

      <div className="min-h-5">
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
