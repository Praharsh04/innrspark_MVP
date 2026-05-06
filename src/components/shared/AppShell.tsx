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
      <div className={`min-h-dvh px-6 py-6 ${showBottomNav ? "pb-28" : "pb-8"} ${contentClassName}`}>
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </MobileFrame>
  );
}
