import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "panel" | "outline";

type CardProps = {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const variantClasses: Record<CardVariant, string> = {
  default: "mobile-card",
  panel: "mobile-panel",
  outline: "rounded-mobile-card border border-brand-black bg-white/65",
};

export function Card({ children, variant = "default", className = "", ...props }: CardProps) {
  return (
    <div className={`${variantClasses[variant]} p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}
