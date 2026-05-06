"use client";

import { motion } from "framer-motion";

type LoadingDotsProps = {
  label?: string;
  className?: string;
};

export function LoadingDots({ label = "Loading", className = "" }: LoadingDotsProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label={label} role="status">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-3 w-3 rounded-full border border-brand-black/10 bg-brand-yellow shadow-card"
          animate={{ y: [0, -6, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.85, repeat: Infinity, delay: dot * 0.14, ease: "easeInOut" }}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
