import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border border-brand-black/10 bg-brand-yellow text-brand-black shadow-button",
  secondary: "border border-brand-black bg-white/75 text-brand-black shadow-card",
  ghost: "border border-brand-black/20 bg-white/40 text-brand-black shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-6 text-lg",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  className = "",
  type = "button",
  ...props
}: SharedButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-pill font-extrabold tracking-tight transition duration-200 active:scale-[0.98]",
    fullWidth ? "w-full" : "w-auto",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
