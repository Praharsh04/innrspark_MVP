"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Map, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";

export function RoadmapGenerating() {
  const router = useRouter();
  const loadMockRoadmap = useRoadmapStore((state) => state.loadMockRoadmap);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadMockRoadmap();
      router.push("/roadmap");
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [loadMockRoadmap, router]);

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(180deg,#ffdf47_0%,#fff7bd_48%,#fffdf0_100%)] px-8 text-center">
      <div className="mb-28 flex flex-col items-center">
        <motion.div
          className="relative grid h-36 w-36 place-items-center rounded-full border border-charcoal/10 bg-white/35 shadow-[0_22px_42px_rgba(255,193,7,0.24)] backdrop-blur-sm"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span
            className="absolute inset-3 rounded-full border border-dashed border-charcoal/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative h-24 w-24">
            <motion.svg
              viewBox="0 0 96 96"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M20 72 C26 42 42 58 48 34 C55 10 75 25 78 14"
                stroke="#212121"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="7 8"
                initial={{ pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0.45, 1, 0.65] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>

            <span className="absolute left-[13px] top-[65px] h-4 w-4 rounded-full border-[3px] border-charcoal bg-brand-yellow shadow-sm" />
            <span className="absolute left-[41px] top-[37px] h-4 w-4 rounded-full border-[3px] border-charcoal bg-white shadow-sm" />
            <span className="absolute right-[9px] top-[7px] h-4 w-4 rounded-full border-[3px] border-charcoal bg-brand-yellow shadow-sm" />

            <motion.div
              className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-2xl bg-white shadow-card ring-1 ring-charcoal/10"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Map size={21} strokeWidth={2.5} className="text-charcoal" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-2xl bg-brand-yellow shadow-button ring-1 ring-charcoal/10"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <CheckCircle2 size={22} strokeWidth={2.6} className="text-charcoal" />
            </motion.div>
            <motion.div
              className="absolute right-1 top-10 text-charcoal"
              animate={{ rotate: [-8, 8, -8], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={22} strokeWidth={2.4} />
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-8 flex gap-2">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2.5 w-2.5 rounded-full bg-charcoal"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.16 }}
            />
          ))}
        </div>
      </div>

      <p className="max-w-[300px] text-[17px] font-extrabold leading-snug text-brand-black">
        Designing your personalized roadmap
      </p>
    </div>
  );
}
