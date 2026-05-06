"use client";

import { LogOut, Settings, Bell, Shield, Info, Map, Award, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/shared/BottomNav";
import { SettingItem } from "@/components/profile/SettingItem";
import { useUserStore } from "@/store/useUserStore";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const selectedCareer = "UX Designer";

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <MobileShell withBottomNav>
      <div className="flex min-h-dvh flex-col px-screen pt-12">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-brand-yellow/10 p-1.5 ring-4 ring-brand-yellow/20 shadow-premium">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-brand-yellow shadow-inner border border-charcoal/5">
                <User size={52} strokeWidth={2.5} />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-brand-yellow ring-4 ring-brand-cream shadow-premium border border-white/20 active:scale-90 transition-transform">
              <Settings size={16} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mt-6 text-[30px] font-black text-charcoal tracking-tight leading-none">
            {user?.email?.split('@')[0] || "Alex Johnson"}
          </h1>
          <p className="mt-2 text-[15px] font-bold text-charcoal/40 tracking-wide uppercase">
            {user?.email || "alex.johnson@example.com"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-charcoal/10 transition active:scale-[0.98]">
            <Award className="text-brand-yellow mb-3" size={24} strokeWidth={2.5} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Assessment</p>
            <p className="text-[15px] font-black text-charcoal mt-1">COMPLETED</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-charcoal/10 transition active:scale-[0.98]">
            <Map className="text-brand-yellow mb-3" size={24} strokeWidth={2.5} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/30">Career Path</p>
            <p className="text-[15px] font-black text-charcoal mt-1 truncate uppercase">{selectedCareer}</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="mt-10 mb-8 flex-1">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30 px-1.5 mb-2.5">Account</h3>
          <div className="space-y-0.5">
            <SettingItem icon={<User size={20} strokeWidth={2.5} />} label="Personal Information" />
            <SettingItem icon={<Bell size={20} strokeWidth={2.5} />} label="Notifications" value="On" />
          </div>

          <h3 className="mt-10 text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30 px-1.5 mb-2.5">Support</h3>
          <div className="space-y-0.5">
            <SettingItem icon={<Shield size={20} strokeWidth={2.5} />} label="Privacy & Security" />
            <SettingItem icon={<Info size={20} strokeWidth={2.5} />} label="Help Center" />
          </div>

          <div className="mt-12 mb-6">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-charcoal/10 bg-white py-4.5 shadow-sm transition-all active:scale-[0.97] hover:border-brand-yellow/50 group"
            >
              <LogOut size={20} strokeWidth={2.5} className="text-charcoal/40 group-hover:text-brand-yellow transition-colors" />
              <span className="text-[13px] font-black uppercase tracking-[0.2em] text-charcoal/70 group-hover:text-charcoal transition-colors">
                Log Out
              </span>
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileShell>
  );
}
