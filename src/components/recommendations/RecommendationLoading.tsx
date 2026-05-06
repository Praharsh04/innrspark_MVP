"use client";

import { motion } from "framer-motion";

export function RecommendationLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-brand-cream px-screen text-center">
      <div className="relative mb-12 flex h-24 w-24 items-center justify-center">
        <motion.div
          className="absolute h-full w-full rounded-full border-4 border-brand-yellow/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute h-full w-full rounded-full border-4 border-brand-yellow border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="h-12 w-12 rounded-full bg-brand-yellow shadow-[0_0_20px_rgba(255,212,0,0.4)]" />
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-[300px] text-[22px] font-black leading-tight text-charcoal tracking-tight"
      >
        Finding your perfect fit...
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-[13px] font-black uppercase tracking-[0.2em] text-charcoal/30"
      >
        mapping your strengths and preferences.
      </motion.p>
    </div>
  );
}
