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
    <div className="absolute inset-0 z-50 flex items-end justify-center px-4 pb-32 sm:px-6">
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
        className="relative max-h-[70vh] w-full overflow-hidden rounded-[32px] border border-charcoal/10 bg-white shadow-premium"
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-[22px] font-black tracking-tight text-charcoal">{milestone.title}</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/5 text-charcoal/50 hover:bg-charcoal/10 transition-colors"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="overflow-y-auto px-8 pb-12 pt-2 scroll-smooth no-scrollbar">
          <p className="mb-8 text-[14px] font-bold text-charcoal/40 uppercase tracking-[0.15em] leading-relaxed">
            {milestone.description}
          </p>

          <div className="space-y-3">
            {milestone.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`
                  flex w-full items-center gap-4 text-left p-4 rounded-[20px] transition-all duration-300 group border-2
                  ${task.completed 
                    ? "bg-brand-yellow/5 border-brand-yellow/20" 
                    : "bg-charcoal/[0.02] border-transparent hover:bg-charcoal/[0.04] hover:border-charcoal/5"
                  }
                `}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                  task.completed 
                    ? "bg-brand-yellow border-charcoal shadow-sm scale-110" 
                    : "border-charcoal/10 bg-white group-hover:border-charcoal/30"
                }`}>
                  {task.completed && <Check size={14} strokeWidth={4} className="text-charcoal" />}
                </div>
                <div className="flex flex-col gap-0.5">
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
