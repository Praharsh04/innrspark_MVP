import { ReactNode } from "react";

type MobileShellProps = {
  children: ReactNode;
  withBottomNav?: boolean;
};

export function MobileShell({ children, withBottomNav = false }: MobileShellProps) {
  return (
    <main className="min-h-dvh bg-[#F2F0E4] text-charcoal sm:grid sm:place-items-center sm:p-4">
      <section className="mx-auto min-h-dvh w-full max-w-[390px] overflow-hidden rounded-none bg-brand-cream shadow-premium ring-1 ring-charcoal/5 sm:min-h-[844px] sm:rounded-[32px]">
        <div
          className={`relative min-h-dvh ${
            withBottomNav 
              ? "pb-[calc(104px+env(safe-area-inset-bottom))]" 
              : "pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          }`}
        >
          {children}
        </div>
      </section>
    </main>
  );
}
