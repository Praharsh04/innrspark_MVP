import type { ReactNode } from "react";

type MobileFrameProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function MobileFrame({ children, className = "", padded = true }: MobileFrameProps) {
  return (
    <main className="app-shell min-h-dvh w-full text-brand-black sm:grid sm:place-items-center sm:bg-[#f2f0e4] sm:p-4">
      <section
        className={`mobile-screen relative overflow-hidden sm:min-h-[844px] sm:rounded-[32px] sm:shadow-[0_18px_44px_rgba(33,33,33,0.14)] sm:ring-1 sm:ring-brand-black/10 ${
          padded ? "px-6 py-6" : ""
        } ${className}`}
      >
        {children}
      </section>
    </main>
  );
}
