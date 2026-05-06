"use client";

import { ChevronRight } from "lucide-react";

type SettingItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
  danger?: boolean;
  onClick?: () => void;
};

export function SettingItem({ icon, label, value, danger, onClick }: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between py-4.5 border-b border-charcoal/5 active:bg-charcoal/5 active:scale-[0.985] transition-all px-1.5"
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm border border-charcoal/5 ${danger ? "bg-red-50 text-red-500" : "bg-white text-charcoal/60"}`}>
          {icon}
        </div>
        <span className={`text-[16px] font-bold tracking-tight ${danger ? "text-red-500" : "text-charcoal"}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-[14px] font-bold text-charcoal/30 uppercase tracking-widest">{value}</span>}
        <ChevronRight size={18} strokeWidth={2.5} className="text-charcoal/20" />
      </div>
    </button>
  );
}

