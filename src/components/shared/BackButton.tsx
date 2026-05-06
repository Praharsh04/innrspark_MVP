"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

type BackButtonProps = {
  label?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BackButton({ label = "Back", className = "", onClick, ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-black/15 bg-white/65 text-brand-black shadow-card transition active:scale-95 ${className}`}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          router.back();
        }
      }}
      {...props}
    >
      <ArrowLeft size={22} strokeWidth={2.4} />
    </button>
  );
}
