"use client";

import type { RoadmapMilestone } from "@/types/roadmap";
import { X, Check } from "lucide-react";
import { motion } from "framer-motion";

type MilestoneModalProps = {
  milestone: RoadmapMilestone;
  onClose: () => void;
  onToggleTask: (taskId: string) => void;
};

export function MilestoneModal({ milestone, onClose, onToggleTask }: MilestoneModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.section
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative flex max-h-[72vh] w-full flex-col overflow-hidden rounded-[32px] border border-charcoal/10 bg-white shadow-premium"
      >
        <div className="shrink-0 px-6 pb-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="break-words text-[22px] font-black leading-tight tracking-tight text-charcoal">{milestone.title}</h2>
              <p className="mt-2 text-[13px] font-semibold leading-relaxed text-charcoal/45">
                {milestone.description}
              </p>
            </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/50 transition-colors hover:bg-charcoal/10"
            aria-label="Close milestone tasks"
          >
            <X size={20} strokeWidth={3} />
          </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-7 pt-1 scroll-smooth no-scrollbar">
          <div className="space-y-2.5">
            {milestone.tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onToggleTask(task.id)}
                className={`
                  flex w-full items-start gap-3 rounded-[20px] border p-4 text-left transition-all duration-300 group
                  ${task.completed 
                    ? "border-brand-yellow/25 bg-brand-yellow/5" 
                    : "border-charcoal/5 bg-charcoal/[0.02] hover:bg-charcoal/[0.04]"
                  }
                `}
              >
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                  task.completed 
                    ? "bg-brand-yellow border-charcoal shadow-sm scale-110" 
                    : "border-charcoal/10 bg-white group-hover:border-charcoal/30"
                }`}>
                  {task.completed && <Check size={14} strokeWidth={4} className="text-charcoal" />}
                </div>
                <div className="min-w-0 flex flex-col gap-1">
                  <span className={`text-[15px] font-black leading-tight transition-all duration-300 ${
                    task.completed 
                      ? "text-charcoal/40 line-through decoration-charcoal/30 decoration-2" 
                      : "text-charcoal"
                  }`}>
                    {task.title}
                  </span>
                  {task.description && !task.completed && (
                    <span className="text-[12px] font-bold text-charcoal/40 leading-snug">
                      {task.description}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
