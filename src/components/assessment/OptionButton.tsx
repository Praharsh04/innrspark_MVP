"use client";

import { AssessmentOption } from "@/types/assessment";

type OptionButtonProps = {
  option: AssessmentOption;
  isSelected: boolean;
  onSelect: (key: string) => void;
  disabled?: boolean;
};

export function OptionButton({ option, isSelected, onSelect, disabled }: OptionButtonProps) {
  return (
    <button
      onClick={() => onSelect(option.key)}
      disabled={disabled}
      className={`
        grid min-h-[58px] w-full grid-cols-[48px_1fr_32px] items-center rounded-pill border px-3 text-[15px] transition-all duration-200
        ${isSelected 
          ? "border-brand-yellow bg-white text-charcoal shadow-[0_0_0_1px_rgba(255,215,0,0.28)]" 
          : "border-charcoal/60 bg-white text-charcoal hover:border-charcoal"
        }
        ${disabled ? "cursor-default opacity-80" : "active:scale-[0.98]"}
      `}
    >
      <span className={`
        flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px] font-bold
        ${isSelected ? "bg-brand-yellow text-charcoal" : "bg-transparent text-charcoal"}
      `}>
        {option.key}
      </span>
      <span className="text-center font-semibold leading-snug">{option.text}</span>
      <span aria-hidden="true" />
    </button>
  );
}
