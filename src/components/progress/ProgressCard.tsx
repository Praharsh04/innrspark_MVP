"use client";

import { ReactNode } from "react";

type ProgressCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
};

export function ProgressCard({ title, value, subtitle, icon, className = "" }: ProgressCardProps) {
  return (
    <div className={`rounded-2xl border border-charcoal/15 bg-white p-5 shadow-sm transition active:scale-[0.98] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">{title}</p>
          <p className="mt-1.5 text-2xl font-black text-charcoal leading-none">{value}</p>
          {subtitle && <p className="mt-2 text-[13px] font-bold text-charcoal/50 leading-snug">{subtitle}</p>}
        </div>
        {icon && <div className="text-brand-yellow ml-2">{icon}</div>}
      </div>
    </div>
  );
}

