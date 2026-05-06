"use client";

import { useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { MilestoneModal } from "./MilestoneModal";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Flag } from "lucide-react";

const MILESTONE_SPACING = 160;

export function RoadmapView() {
  const roadmap = useRoadmapStore((state) => state.roadmap);
  const activeMilestoneId = useRoadmapStore((state) => state.activeMilestoneId);
  const loadSavedRoadmap = useRoadmapStore((state) => state.loadSavedRoadmap);
  const loadMockRoadmap = useRoadmapStore((state) => state.loadMockRoadmap);
  const setActiveMilestoneId = useRoadmapStore((state) => state.setActiveMilestoneId);
  const toggleTask = useRoadmapStore((state) => state.toggleTask);

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

  if (!roadmap) {
    return (
      <div className="flex h-full min-h-0 flex-col items-center justify-center bg-brand-cream px-8 pb-[calc(8.5rem+env(safe-area-inset-bottom))] text-center">
        <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-brand-yellow border-t-charcoal" />
        <h2 className="text-2xl font-black text-charcoal tracking-tight">Crafting your path...</h2>
        <p className="mt-2 font-bold text-charcoal/40 uppercase tracking-widest text-sm">SPARKI IS ANALYZING YOUR PROFILE</p>
      </div>
    );
  }

  const milestones = roadmap.milestones;
  const activeMilestone = milestones.find((m) => m.id === activeMilestoneId);
  const containerHeight = (milestones.length + 1) * MILESTONE_SPACING;

  // Generate SVG path points (Bottom to Top)
  const generatePath = () => {
    const points = [];
    const centerX = 167;
    const amplitude = 90;
    
    // We generate points from index 0 to length + 1, then reverse
    for (let i = 0; i <= milestones.length + 1; i++) {
      const y = i * MILESTONE_SPACING;
      let x = centerX;
      if (i > 0 && i <= milestones.length) {
        x = i % 2 === 1 ? centerX - amplitude : centerX + amplitude;
      }
      points.push({ x, y });
    }
    
    // Reverse points to make path flow from bottom to top
    points.reverse();
    
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  return (
    <div className="relative flex h-full flex-col bg-brand-cream">
      {/* Fixed Header */}
      <header className="sticky top-0 z-20 flex flex-col items-center justify-center bg-brand-cream/80 backdrop-blur-md px-6 py-6 border-b border-charcoal/5">
        <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-charcoal/30">Your Journey to</h1>
        <h2 className="text-[22px] font-black text-charcoal tracking-tight leading-none mt-1">{roadmap.careerTitle}</h2>
      </header>

      <div className="flex-1 overflow-y-auto pt-12 pb-[calc(10rem+env(safe-area-inset-bottom))] scroll-smooth no-scrollbar">
        <div 
          className="relative mx-auto w-full max-w-[334px]"
          style={{ height: `${containerHeight}px` }}
        >
          {/* SVG Journey Path */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            viewBox={`0 0 334 ${containerHeight}`}
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={generatePath()}
              stroke="url(#path-gradient)"
              strokeWidth="4"
              strokeDasharray="1 12"
              strokeLinecap="round"
              className="text-charcoal/20"
            />
            <defs>
              <linearGradient id="path-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="10%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="90%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Start Node (Now at Bottom) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-charcoal text-brand-yellow shadow-premium ring-8 ring-brand-cream"
            >
              <Star size={24} strokeWidth={3} fill="currentColor" />
            </motion.div>
            <span className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40">START</span>
          </div>

          {/* Milestone Pills (Visual order reversed) */}
          {milestones.map((milestone, index) => {
            const milestoneNumber = index + 1;
            // Reverse top position calculation: Milestone 1 (index 0) is closest to bottom
            const topPos = (milestones.length - index) * MILESTONE_SPACING;
            const isCompleted = milestone.tasks.every(t => t.completed);
            const isStarted = milestone.tasks.some(t => t.completed);
            const amplitude = 70;
            const nodeX = milestoneNumber % 2 === 1 ? 167 - amplitude : 167 + amplitude;
            const pillOnRight = milestoneNumber % 2 === 1;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: pillOnRight ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="absolute z-10 w-full"
                style={{ top: `${topPos}px` }}
              >
                {/* Connecting Node on Path */}
                <div 
                  className={`absolute w-4 h-4 rounded-full border-[3px] border-brand-cream shadow-sm z-20 transition-all duration-500
                    ${isCompleted ? "bg-brand-yellow scale-125 shadow-goldSpark/50" : "bg-charcoal/20"}
                  `}
                  style={{ 
                    left: `${nodeX}px`, 
                    top: '0',
                    transform: 'translate(-50%, -50%)' 
                  }}
                />

                <button
                  type="button"
                  onClick={() => setActiveMilestoneId(milestone.id)}
                  className={`
                    absolute top-0 flex items-center gap-3 rounded-[20px] border-2 px-4 py-2.5 transition-all duration-300 active:scale-[0.96] shadow-button
                    ${isCompleted 
                      ? "bg-brand-yellow border-charcoal text-charcoal" 
                      : isStarted
                        ? "bg-white border-brand-yellow text-charcoal"
                        : "bg-white border-charcoal/10 text-charcoal/80"
                    }
                    ${pillOnRight ? "flex-row" : "flex-row-reverse"}
                    max-w-[170px] w-max
                  `}
                  style={{ 
                    left: pillOnRight ? `${nodeX + 20}px` : 'auto',
                    right: !pillOnRight ? `${334 - nodeX + 20}px` : 'auto',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <div className={`
                    flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-black text-[10px] border
                    ${isCompleted ? "bg-charcoal text-brand-yellow border-transparent" : "bg-charcoal/5 border-charcoal/10"}
                  `}>
                    {milestoneNumber}
                  </div>
                  <span className="text-[12px] font-black leading-tight tracking-tight uppercase truncate max-w-[100px]">
                    {milestone.title}
                  </span>
                </button>
              </motion.div>
            );
          })}

          {/* End Node (Now at Top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-charcoal shadow-premium ring-8 ring-brand-cream border-2 border-charcoal"
            >
              <Flag size={28} strokeWidth={3} />
            </motion.div>
            <span className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/60">GOAL REACHED</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeMilestone && (
          <MilestoneModal
            milestone={activeMilestone}
            onClose={() => setActiveMilestoneId(null)}
            onToggleTask={toggleTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
