"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function RecommendationLoading() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center bg-[linear-gradient(180deg,#fff2a8_0%,#fffbea_55%,#fffef8_100%)] px-screen py-[max(2rem,env(safe-area-inset-top))] text-center">
      <div className="relative mb-9 flex h-28 w-28 -translate-y-3 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-[36px] border border-charcoal/10 bg-white/50 shadow-[0_20px_42px_rgba(255,199,0,0.18)] backdrop-blur"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute h-20 w-20 rounded-full border-2 border-dashed border-charcoal/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative grid h-14 w-14 place-items-center rounded-2xl bg-brand-yellow text-charcoal shadow-button"
          animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={26} strokeWidth={2.6} />
        </motion.div>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-[300px] text-[22px] font-black leading-tight tracking-tight text-charcoal"
      >
        Mapping your strongest career signals
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-[13px] font-black uppercase tracking-[0.2em] text-charcoal/30"
      >
        comparing strengths, traits, and fit
      </motion.p>
    </div>
  );
}
