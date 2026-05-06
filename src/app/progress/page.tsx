"use client";

import { TrendingUp, CheckCircle2, Flag, ArrowRight } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { BottomNav } from "@/components/shared/BottomNav";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { mockRoadmap } from "@/data/mockRoadmap";

export default function ProgressPage() {
  // Mock data for now since stores are being refactored
  const selectedCareer = "Product Manager";
  const completedTasks = ["Read about product manager responsibilities", "Map one app you use daily"];

  // Calculate stats from mockRoadmap (assuming it's the selected one)
  const totalTasks = mockRoadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedCount = completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const currentMilestone = mockRoadmap.milestones.find(m =>
    m.tasks.some(t => !completedTasks.includes(t.title))
  ) || mockRoadmap.milestones[0];

  const nextTask = currentMilestone.tasks.find(t => !completedTasks.includes(t.title));

  return (
    <MobileShell withBottomNav>
      <div className="flex min-h-dvh flex-col px-screen pt-12">
        <h1 className="text-[34px] font-black tracking-tight text-charcoal leading-none">Your Progress</h1>
        <p className="mt-4 text-[17px] font-bold text-charcoal/50 leading-relaxed">Keep going! You&apos;re making great strides.</p>

        {/* Career Summary */}
        <div className="mt-10 rounded-3xl bg-charcoal p-7 text-white shadow-premium relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Current Path</span>
            <div className="rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase text-charcoal shadow-sm">Active</div>
          </div>
          <h2 className="mt-3 text-[26px] font-black relative z-10 tracking-tight">{selectedCareer}</h2>

          <div className="mt-8 relative z-10">
            <div className="flex justify-between text-[13px] font-black mb-2.5">
              <span className="text-white/60 uppercase tracking-widest">Roadmap Completion</span>
              <span className="text-brand-yellow">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <ProgressCard
            title="Tasks"
            value={completedCount}
            subtitle={`of ${totalTasks} total`}
            icon={<CheckCircle2 size={22} strokeWidth={2.5} />}
          />
          <ProgressCard
            title="Milestone"
            value={1}
            subtitle="of 5 levels"
            icon={<Flag size={22} strokeWidth={2.5} />}
          />
        </div>

        {/* Next Task Card */}
        <div className="mt-5 rounded-3xl border-2 border-dashed border-charcoal/10 bg-white/40 p-6 transition active:scale-[0.98]">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">Next Recommended Task</p>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-softYellow text-charcoal shadow-sm border border-charcoal/5">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-[17px] font-black text-charcoal leading-tight tracking-tight">
                {nextTask?.title || "No more tasks!"}
              </h3>
              <p className="mt-1.5 text-[13px] font-bold text-charcoal/40 uppercase tracking-wide">In {currentMilestone.title}</p>
            </div>
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/5">
              <ArrowRight size={16} strokeWidth={2.5} className="text-charcoal/30" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 mb-8">
          <h4 className="text-[20px] font-black text-charcoal tracking-tight">Recent Completions</h4>
          <div className="mt-5 space-y-4">
            {completedTasks.slice(0, 2).map((task, i) => (
              <div key={i} className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-white border border-charcoal/5 shadow-sm">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-yellow shadow-sm" />
                <span className="text-[15px] font-bold text-charcoal/70 leading-snug">{task}</span>
              </div>
            ))}
          </div>
        </div>

        <BottomNav />
      </div>
    </MobileShell>
  );
}
