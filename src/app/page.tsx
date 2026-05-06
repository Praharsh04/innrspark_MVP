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
        className="flex min-h-dvh w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[linear-gradient(180deg,#fff1a3_0%,#fff7ce_50%,#fffef8_100%)] px-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[18vh] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <p className="text-[30px] font-normal leading-none text-charcoal">
            Welcome to
          </p>
          <div className="mt-10 drop-shadow-[0_12px_18px_rgba(255,199,0,0.16)]">
            <SparkLogo />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
          <p className="mb-7 text-[30px] font-normal leading-none text-charcoal">
            Let&apos;s Begin Your
          </p>
          <div className="w-full max-w-[260px] rounded-[28px] border border-white/50 bg-[#ffd400] py-3.5 shadow-[0_16px_28px_rgba(255,199,0,0.28)] transition-transform duration-200 active:scale-[0.96]">
            <span className="text-[32px] font-black leading-none text-white">
              Journey
            </span>
          </div>
        </motion.div>

        <p className="text-[18px] font-normal text-charcoal/80">
          Tap to continue
        </p>
      </button>
    </MobileShell>
  );
}
