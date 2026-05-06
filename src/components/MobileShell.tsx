import { ReactNode } from "react";
import { BottomNav } from "@/components/shared/BottomNav";

type MobileShellProps = {
  children: ReactNode;
  withBottomNav?: boolean;
};

export function MobileShell({ children, withBottomNav = false }: MobileShellProps) {
  return (
    <main className="min-h-dvh overflow-x-hidden bg-[#F2F0E4] text-charcoal sm:flex sm:items-center sm:justify-center sm:p-6 md:p-8">
      <section className="relative mx-auto flex h-full min-h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-brand-cream shadow-none ring-0 sm:h-[844px] sm:min-h-0 sm:rounded-[32px] sm:shadow-premium sm:ring-1 sm:ring-charcoal/5">
        <div
          className={`relative flex h-full min-h-0 flex-1 flex-col ${
            withBottomNav 
              ? "pb-0" 
              : "pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          }`}
        >
          {children}
        </div>
        {withBottomNav && <BottomNav />}
      </section>
    </main>
  );
}
