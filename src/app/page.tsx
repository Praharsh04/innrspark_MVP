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
        className="flex h-full w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[linear-gradient(180deg,#fff5b6_0%,#fffbea_52%,#fffef8_100%)] px-8 pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[11vh] text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <p className="text-[24px] font-semibold uppercase leading-none tracking-[0.22em] text-charcoal/48">
            Welcome to
          </p>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            className="mb-7 mt-11 flex h-[230px] w-[230px] max-w-[72vw] items-center justify-center drop-shadow-[0_18px_28px_rgba(255,199,0,0.16)]"
          >
            <SparkLogo hero className="w-full" />
          </motion.div>
          <p className="text-[12px] font-black uppercase tracking-[0.24em] text-charcoal/34">
            Explore • Empower • Evolve
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
          <p className="mb-5 text-[22px] font-black leading-tight text-charcoal">
            Let&apos;s Begin Your
          </p>
          <div className="w-full max-w-[188px] rounded-[24px] border border-charcoal/5 bg-[#ffd400] py-3.5 shadow-[0_12px_24px_rgba(255,199,0,0.22)] transition-transform duration-200 active:scale-[0.96]">
            <span className="text-[24px] font-black uppercase leading-none text-charcoal">
              Journey
            </span>
          </div>
        </motion.div>

        <p className="text-[12px] font-black uppercase tracking-[0.2em] text-charcoal/28">
          Tap to continue
        </p>
      </button>
    </MobileShell>
  );
}
