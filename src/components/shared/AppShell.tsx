import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { MobileFrame } from "./MobileFrame";

type AppShellProps = {
  children: ReactNode;
  showBottomNav?: boolean;
  className?: string;
  contentClassName?: string;
};

export function AppShell({
  children,
  showBottomNav = false,
  className = "",
  contentClassName = "",
}: AppShellProps) {
  return (
    <MobileFrame className={className} padded={false}>
      <div className={`h-full min-h-0 overflow-y-auto px-6 py-6 no-scrollbar ${showBottomNav ? "pb-[calc(8.5rem+env(safe-area-inset-bottom))]" : "pb-8"} ${contentClassName}`}>
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </MobileFrame>
  );
}
