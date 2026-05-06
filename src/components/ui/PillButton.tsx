import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
};

const styles = {
  primary:
    "bg-amberSpark text-charcoal shadow-premium border border-charcoal/15 hover:bg-goldSpark",
  ghost: "bg-white/70 text-charcoal border border-charcoal/35 shadow-insetGlow hover:bg-white",
};

export function PillButton({ href, children, variant = "primary", className = "", ...props }: PillButtonProps) {
  const common = `inline-flex min-h-14 w-full items-center justify-center rounded-full px-6 text-lg font-extrabold tracking-tight transition duration-200 active:scale-[0.98] ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={common}>
        {children}
      </Link>
    );
  }

  return (
    <button className={common} {...props}>
      {children}
    </button>
  );
}
