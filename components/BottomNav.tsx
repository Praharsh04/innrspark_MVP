"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, CircleUserRound, Map, TrendingUp } from "lucide-react";

const items = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/chat", label: "Sparki", icon: Bot },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 rounded-t-[30px] border border-charcoal/15 bg-lemon/90 px-3 pb-[max(0.55rem,env(safe-area-inset-bottom))] pt-2 shadow-premium backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={`relative flex flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[11px] font-bold transition ${
                active ? "text-charcoal" : "text-charcoal/50"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full transition ${
                  active ? "bg-amberSpark text-charcoal shadow-soft ring-1 ring-charcoal/10" : "bg-transparent"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
