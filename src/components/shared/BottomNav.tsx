"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, CircleUserRound, Map, TrendingUp } from "lucide-react";

const navItems = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/chat", label: "Sparki", icon: Bot },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 rounded-t-[32px] border-t border-charcoal/10 bg-white/90 px-screen pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(33,33,33,0.06)] backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 rounded-2xl px-1 py-1.5 transition-all active:scale-90 ${
                active ? "text-brand-yellow" : "text-charcoal/40"
              }`}
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-2xl transition-all ${
                  active ? "bg-brand-yellow/10 shadow-inner" : "bg-transparent"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 3 : 2.2} />
              </span>
              <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${active ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
