"use client";

import { useEffect, useMemo } from "react";
import { ArrowRight, CheckCircle2, Flag, Map, TrendingUp } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useRoadmapStore } from "@/store/useRoadmapStore";

export default function ProgressPage() {
  const roadmap = useRoadmapStore((state) => state.roadmap);
  const loadSavedRoadmap = useRoadmapStore((state) => state.loadSavedRoadmap);
  const loadMockRoadmap = useRoadmapStore((state) => state.loadMockRoadmap);

  useEffect(() => {
    if (roadmap) {
      return;
    }

    loadSavedRoadmap().then((loaded) => {
      if (!loaded) {
        loadMockRoadmap();
      }
    });
  }, [loadMockRoadmap, loadSavedRoadmap, roadmap]);

  const progress = useMemo(() => {
    const milestones = roadmap?.milestones ?? [];
    const tasks = milestones.flatMap((milestone) =>
      milestone.tasks.map((task) => ({
        ...task,
        milestoneId: milestone.id,
        milestoneTitle: milestone.title,
      })),
    );
    const completedTasks = tasks.filter((task) => task.completed);
    const nextTask = tasks.find((task) => !task.completed) ?? null;
    const currentMilestone =
      milestones.find((milestone) => milestone.tasks.some((task) => !task.completed)) ??
      milestones[milestones.length - 1] ??
      null;
    const completedMilestones = milestones.filter(
      (milestone) => milestone.tasks.length > 0 && milestone.tasks.every((task) => task.completed),
    ).length;
    const percentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    return {
      completedTasks,
      currentMilestone,
      completedMilestones,
      nextTask,
      percentage,
      totalMilestones: milestones.length,
      totalTasks: tasks.length,
    };
  }, [roadmap]);

  return (
    <MobileShell withBottomNav>
      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-brand-cream px-screen pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] no-scrollbar">
        <h1 className="text-[34px] font-black leading-none tracking-tight text-charcoal">Your Progress</h1>
        <p className="mt-4 text-[17px] font-bold leading-relaxed text-charcoal/50">
          {progress.totalTasks > 0
            ? "Track how each completed task moves your roadmap forward."
            : "Your roadmap progress will appear here once a path is generated."}
        </p>

        <section className="mt-9 rounded-3xl border border-charcoal/10 bg-white p-7 shadow-sm">
          <div className="space-y-6">
            {/* Roadmap Progress */}
            <div>
              <div className="mb-2.5 flex items-end justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">ROADMAP PROGRESS</span>
                <span className="text-[18px] font-black leading-none text-charcoal">{progress.percentage}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-charcoal/5">
                <div
                  className="h-full rounded-full bg-brand-yellow transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Milestones Progress */}
            <div>
              <div className="mb-2.5 flex items-end justify-between">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">MILESTONES</span>
                <span className="text-[14px] font-black leading-none text-charcoal">
                  {progress.completedMilestones} of {progress.totalMilestones}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-charcoal/5">
                <div
                  className="h-full rounded-full bg-brand-yellow transition-all duration-500"
                  style={{
                    width: `${progress.totalMilestones > 0 ? (progress.completedMilestones / progress.totalMilestones) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <ProgressCard
            title="Tasks"
            value={progress.completedTasks.length}
            subtitle={`of ${progress.totalTasks} total`}
            icon={<CheckCircle2 size={22} strokeWidth={2.5} />}
          />
          <ProgressCard
            title="Milestones"
            value={progress.completedMilestones}
            subtitle={`of ${progress.totalMilestones} complete`}
            icon={<Flag size={22} strokeWidth={2.5} />}
          />
        </section>

        <section className="mt-5 rounded-3xl border-2 border-dashed border-charcoal/10 bg-white/50 p-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">Next Recommended Task</p>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-charcoal/5 bg-brand-softYellow text-charcoal shadow-sm">
              <TrendingUp size={22} strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="break-words text-[17px] font-black leading-tight tracking-tight text-charcoal">
                {progress.nextTask?.title ?? "No open tasks right now"}
              </h3>
              <p className="mt-1.5 text-[13px] font-bold uppercase tracking-wide text-charcoal/40">
                {progress.currentMilestone ? `In ${progress.currentMilestone.title}` : "Generate a roadmap to begin"}
              </p>
            </div>
            <div className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal/5">
              <ArrowRight size={16} strokeWidth={2.5} className="text-charcoal/30" />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-2">
            <Map size={20} strokeWidth={2.5} className="text-brand-yellow" />
            <h4 className="text-[20px] font-black tracking-tight text-charcoal">Recent Completions</h4>
          </div>
          <div className="mt-5 space-y-3">
            {progress.completedTasks.length > 0 ? (
              progress.completedTasks.slice(-4).reverse().map((task) => (
                <div key={task.id} className="flex items-start gap-4 rounded-2xl border border-charcoal/5 bg-white px-4 py-3 shadow-sm">
                  <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-yellow shadow-sm" />
                  <div className="min-w-0">
                    <span className="block break-words text-[15px] font-bold leading-snug text-charcoal/75">{task.title}</span>
                    <span className="mt-1 block text-[12px] font-black uppercase tracking-[0.14em] text-charcoal/30">
                      {task.milestoneTitle}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-charcoal/5 bg-white/70 px-4 py-5 text-center shadow-sm">
                <p className="text-[14px] font-bold leading-relaxed text-charcoal/45">
                  Check off tasks from your roadmap and they will show up here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MobileShell>
  );
}
