"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Award,
  Bell,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  LogOut,
  Map,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { useUserStore } from "@/store/useUserStore";

type ProfilePanel = "personal" | "notifications" | "privacy" | "help" | null;

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, hydrateFromSupabase } = useUserStore();
  const { isComplete: assessmentComplete } = useAssessmentStore();
  const { roadmap } = useRoadmapStore();
  const [activePanel, setActivePanel] = useState<ProfilePanel>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    hydrateFromSupabase();
  }, [hydrateFromSupabase]);

  const userName = user?.name?.trim() || formatNameFromEmail(user?.email) || "Guest Explorer";
  const userEmail = user?.email || "No email connected";
  const avatarUrl = getAvatarUrl(user);
  const initials = getInitials(userName, user?.email);

  const progress = useMemo(() => {
    const tasks = roadmap?.milestones.flatMap((milestone) => milestone.tasks) ?? [];
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }, [roadmap]);

  const selectedCareer = roadmap?.careerTitle || "No path selected yet";
  const progressLabel =
    progress.total > 0 ? `${progress.completed}/${progress.total} tasks` : "No roadmap yet";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/auth");
  };

  return (
    <MobileShell withBottomNav>
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-[linear-gradient(180deg,#fff7ce_0%,#fffdf4_42%,#fff9df_100%)] px-screen pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] no-scrollbar">
        <header className="rounded-[32px] border border-white/70 bg-white/72 px-5 py-6 text-center shadow-[0_18px_40px_rgba(33,33,33,0.08)] backdrop-blur">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-[34px] bg-brand-yellow/15 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <div className="grid h-full w-full place-items-center overflow-hidden rounded-[28px] border border-charcoal/5 bg-white text-[34px] font-black text-charcoal shadow-sm">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={`${userName} avatar`} width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                <span aria-label={`${userName} initials`}>{initials}</span>
              )}
            </div>
          </div>

          <p className="mt-5 text-[12px] font-black uppercase tracking-[0.22em] text-charcoal/35">Profile</p>
          <h1 className="mt-2 break-words text-[30px] font-black leading-tight text-charcoal">{userName}</h1>
          <p className="mt-2 break-all text-[13px] font-bold leading-relaxed text-charcoal/45">{userEmail}</p>
        </header>

        <section className="mt-5 grid gap-3">
          <StatusCard
            icon={<Award size={20} strokeWidth={2.6} />}
            label="Assessment"
            value={assessmentComplete ? "Completed" : "Not started"}
            note={assessmentComplete ? "Your career profile is ready." : "Start the assessment to unlock matches."}
          />
          <StatusCard
            icon={<Map size={20} strokeWidth={2.6} />}
            label="Career Path"
            value={selectedCareer}
            note={roadmap?.careerTitle ? "Selected path" : "Choose a recommendation to begin."}
          />
          <StatusCard
            icon={<CheckCircle2 size={20} strokeWidth={2.6} />}
            label="Roadmap Progress"
            value={progress.total > 0 ? `${progress.percentage}% complete` : "Not started"}
            note={progressLabel}
          />
        </section>

        <ProfileGroup title="Account Settings">
          <ProfileAction
            icon={<User size={20} strokeWidth={2.5} />}
            label="Personal Info"
            value="View"
            onClick={() => setActivePanel("personal")}
          />
          <ProfileAction
            icon={<Bell size={20} strokeWidth={2.5} />}
            label="Notifications"
            value={notificationsEnabled ? "Enabled" : "Off"}
            onClick={() => setActivePanel("notifications")}
          />
        </ProfileGroup>

        <ProfileGroup title="Support & Legal">
          <ProfileAction
            icon={<Shield size={20} strokeWidth={2.5} />}
            label="Privacy & Security"
            value="Info"
            onClick={() => setActivePanel("privacy")}
          />
          <ProfileAction
            icon={<HelpCircle size={20} strokeWidth={2.5} />}
            label="Help Center"
            value="FAQ"
            onClick={() => setActivePanel("help")}
          />
        </ProfileGroup>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-[24px] border border-red-200/80 bg-white px-5 py-4 text-red-500 shadow-[0_12px_28px_rgba(33,33,33,0.06)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Log out of Innrspark"
        >
          <LogOut size={21} strokeWidth={2.6} />
          <span className="text-[14px] font-black uppercase tracking-[0.14em]">
            {isLoggingOut ? "Logging out" : "Log Out"}
          </span>
        </button>

        <p className="mt-7 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-charcoal/25">
          Innrspark v1.0.4 Beta
        </p>
      </div>

      {activePanel && (
        <ProfileModal
          panel={activePanel}
          userName={userName}
          userEmail={userEmail}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => setNotificationsEnabled((enabled) => !enabled)}
          onClose={() => setActivePanel(null)}
        />
      )}
    </MobileShell>
  );
}

function StatusCard({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-[26px] border border-white/70 bg-white/82 p-4 shadow-[0_12px_28px_rgba(33,33,33,0.055)] backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] bg-brand-yellow/18 text-charcoal">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-charcoal/35">{label}</p>
          <p className="mt-1 break-words text-[18px] font-black leading-snug text-charcoal">{value}</p>
          <p className="mt-1 text-[13px] font-semibold leading-relaxed text-charcoal/45">{note}</p>
        </div>
      </div>
    </article>
  );
}

function ProfileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-3 px-2 text-[11px] font-black uppercase tracking-[0.22em] text-charcoal/30">{title}</h2>
      <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/86 shadow-[0_14px_32px_rgba(33,33,33,0.06)]">
        {children}
      </div>
    </section>
  );
}

function ProfileAction({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 border-b border-charcoal/[0.05] px-5 py-4 text-left transition last:border-b-0 hover:bg-brand-yellow/5 active:bg-brand-yellow/10"
      aria-label={`Open ${label}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] bg-brand-yellow/14 text-charcoal/75">
          {icon}
        </span>
        <span className="truncate text-[15px] font-black text-charcoal">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="max-w-[116px] truncate text-[12px] font-black uppercase tracking-[0.12em] text-charcoal/35">
          {value}
        </span>
        <ChevronRight size={18} strokeWidth={2.7} className="text-charcoal/18" />
      </span>
    </button>
  );
}

function ProfileModal({
  panel,
  userName,
  userEmail,
  notificationsEnabled,
  onToggleNotifications,
  onClose,
}: {
  panel: Exclude<ProfilePanel, null>;
  userName: string;
  userEmail: string;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  onClose: () => void;
}) {
  const content = getPanelContent(panel, userName, userEmail, notificationsEnabled);

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-charcoal/35 px-screen pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-panel-title"
        className="w-full rounded-[32px] border border-white/70 bg-[#fffdf5] p-5 shadow-[0_24px_60px_rgba(33,33,33,0.22)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-[20px] bg-brand-yellow/18 text-charcoal">
              {content.icon}
            </div>
            <h2 id="profile-panel-title" className="text-[24px] font-black leading-tight text-charcoal">
              {content.title}
            </h2>
            <p className="mt-2 text-[14px] font-semibold leading-relaxed text-charcoal/55">{content.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-charcoal shadow-sm transition active:scale-95"
            aria-label="Close profile panel"
          >
            <X size={20} strokeWidth={2.6} />
          </button>
        </div>

        <div className="mt-5 rounded-[24px] border border-charcoal/5 bg-white p-4">
          {panel === "notifications" ? (
            <button
              type="button"
              onClick={onToggleNotifications}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-label={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
            >
              <span>
                <span className="block text-[15px] font-black text-charcoal">Demo notifications</span>
                <span className="mt-1 block text-[13px] font-semibold leading-relaxed text-charcoal/50">
                  Push notifications are coming soon. This switch previews the setting state.
                </span>
              </span>
              <span
                className={`flex h-8 w-14 items-center rounded-full p-1 transition ${
                  notificationsEnabled ? "bg-brand-yellow" : "bg-charcoal/10"
                }`}
              >
                <span
                  className={`h-6 w-6 rounded-full bg-white shadow-sm transition ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </span>
            </button>
          ) : (
            <div className="space-y-3">
              {content.rows.map((row) => (
                <div key={row.label} className="flex items-start gap-3">
                  <Sparkles size={16} strokeWidth={2.5} className="mt-1 shrink-0 text-brand-yellow" />
                  <div>
                    <p className="text-[13px] font-black uppercase tracking-[0.12em] text-charcoal/35">{row.label}</p>
                    <p className="mt-1 break-words text-[15px] font-bold leading-relaxed text-charcoal">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-[22px] bg-brand-yellow px-5 py-4 text-[14px] font-black uppercase tracking-[0.14em] text-charcoal shadow-[0_12px_24px_rgba(255,199,0,0.22)] transition active:scale-[0.98]"
        >
          Done
        </button>
      </section>
    </div>
  );
}

function getPanelContent(panel: Exclude<ProfilePanel, null>, userName: string, userEmail: string, notificationsEnabled: boolean) {
  if (panel === "personal") {
    return {
      icon: <User size={22} strokeWidth={2.6} />,
      title: "Personal Info",
      description: "This is the profile information Innrspark can currently read from your account.",
      rows: [
        { label: "Name", value: userName },
        { label: "Email", value: userEmail },
      ],
    };
  }

  if (panel === "privacy") {
    return {
      icon: <Shield size={22} strokeWidth={2.6} />,
      title: "Privacy & Security",
      description: "Your app data is tied to your authenticated account. More privacy controls are coming soon.",
      rows: [
        { label: "Authentication", value: "Google sign-in is handled through Supabase Auth." },
        { label: "Data access", value: "Roadmap, assessment, and chat records are scoped to your user account." },
      ],
    };
  }

  if (panel === "help") {
    return {
      icon: <HelpCircle size={22} strokeWidth={2.6} />,
      title: "Help Center",
      description: "Quick help for the current demo build.",
      rows: [
        { label: "Assessment", value: "Complete the assessment to unlock career matches and a roadmap." },
        { label: "Sparki", value: "Ask Sparki for next steps, task explanations, or learning resources." },
        { label: "Support", value: "For now, share feedback directly with the Innrspark team." },
      ],
    };
  }

  return {
    icon: <Bell size={22} strokeWidth={2.6} />,
    title: "Notifications",
    description: notificationsEnabled ? "Notifications are marked enabled for this device." : "Notifications are currently off.",
    rows: [],
  };
}

function formatNameFromEmail(email?: string) {
  if (!email) {
    return "";
  }

  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getInitials(name: string, email?: string) {
  const source = name || formatNameFromEmail(email) || "Guest Explorer";
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "IE";
}

function getAvatarUrl(user: unknown) {
  if (!user || typeof user !== "object") {
    return "";
  }

  const candidate = user as { avatarUrl?: unknown; avatar?: unknown; image?: unknown; picture?: unknown };
  const value = candidate.avatarUrl ?? candidate.avatar ?? candidate.image ?? candidate.picture;

  return typeof value === "string" ? value : "";
}
