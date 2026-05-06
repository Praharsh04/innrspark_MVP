import type { ReactNode } from "react";

type MobileFrameProps = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

export function MobileFrame({ children, className = "", padded = true }: MobileFrameProps) {
  return (
    <main className="min-h-dvh bg-[#F2F0E4] text-charcoal sm:flex sm:items-center sm:justify-center sm:p-6 md:p-8">
      <section
        className={`relative mx-auto flex h-full min-h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-brand-cream shadow-none ring-0 sm:h-[844px] sm:min-h-0 sm:rounded-[32px] sm:shadow-premium sm:ring-1 sm:ring-charcoal/5 ${className}`}
      >
        <div className={`relative flex-1 overflow-y-auto no-scrollbar ${padded ? "px-6 py-6" : ""}`}>
          {children}
        </div>
      </section>
    </main>
  );
}
