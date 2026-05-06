"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { SparkLogo } from "@/components/ui/SparkLogo";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export default function HomePage() {
  const router = useRouter();
  const setIndex = useOnboardingStore((state) => state.setIndex);

  const handleStart = () => {
    setIndex(0); // Ensure onboarding starts from slide 2 (index 0 in carousel)
    router.push("/onboarding");
  };

  return (
    <MobileShell>
      <button
        type="button"
        onClick={handleStart}
        className="flex h-full w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#ffed7c] via-[#fff8c7] to-[#ffffff] px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[10vh] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <p className="text-[34px] font-normal leading-none text-charcoal tracking-tight">
            Welcome to
          </p>
          <div className="mt-14 mb-8 flex h-[280px] w-[280px] max-w-[80vw] items-center justify-center">
            <SparkLogo hero className="w-full" />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-charcoal/80">
            Explore Empower Evolve
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
          <p className="mb-8 text-[34px] font-normal leading-none text-charcoal tracking-tight">
            Let&apos;s Begin Your
          </p>
          <div className="w-full max-w-[240px] rounded-[32px] bg-[#ffd400] py-4.5 shadow-[0_10px_20px_rgba(255,199,0,0.25)] transition-transform duration-200 active:scale-[0.96]">
            <span className="text-[32px] font-black leading-none text-white tracking-tight">
              Journey
            </span>
          </div>
        </motion.div>

        <p className="text-[16px] font-medium text-charcoal/60">
          Tap to continue
        </p>
      </button>
    </MobileShell>
  );
}
