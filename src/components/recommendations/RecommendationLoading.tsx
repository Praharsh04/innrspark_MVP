"use client";

import { motion } from "framer-motion";

export function RecommendationLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-screen text-center">
      <h2 className="mt-[12vh] max-w-[320px] text-[17px] font-semibold leading-tight text-charcoal">
        mapping your strengths and preferences.
      </h2>

      <div className="mt-16 flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`rounded-full bg-brand-gold ${i === 0 ? "h-7 w-7" : i === 1 ? "h-5 w-5 opacity-80" : "h-3.5 w-3.5 opacity-75"}`}
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.45, 1, 0.45],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
