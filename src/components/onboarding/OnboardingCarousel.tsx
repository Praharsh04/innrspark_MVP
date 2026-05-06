"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { onboardingSlides } from "@/data/onboarding";

const slideText: Record<string, { title: string; description: string }> = {
  discover: {
    title: "Feeling lost about your future?",
    description: "Too many choices. Not enough clarity. We'll help you figure out what truly fits you.",
  },
  explore: {
    title: "Start with you",
    description: "Take a short, interactive assessment to understand your strengths, interests, and personality.",
  },
  roadmap: {
    title: "See what fits",
    description: "Get career paths and roles aligned with who you are.",
  },
  sparki: {
    title: "Follow a clear plan",
    description: "A personalized roadmap to help you move forward with confidence.",
  },
};

const visualStyles: Record<string, { image: string }> = {
  discover: {
    image: "h-[330px] w-[310px] max-w-[88%]",
  },
  explore: {
    image: "h-[300px] w-[300px] max-w-[80%]",
  },
  roadmap: {
    image: "h-[320px] w-[330px] max-w-[90%]",
  },
  sparki: {
    image: "h-[315px] w-[330px] max-w-[88%]",
  },
};

export function OnboardingCarousel() {
  const router = useRouter();
  const { currentIndex, nextSlide, setIndex } = useOnboardingStore();
  const didReset = useRef(false);
  
  // Skip the first slide (id: "welcome") as it's for the splash screen
  const carouselSlides = onboardingSlides.slice(1);
  const totalSlides = carouselSlides.length;
  const safeIndex = Math.min(Math.max(currentIndex, 0), totalSlides - 1);
  const currentSlide = carouselSlides[safeIndex] || carouselSlides[0];
  const copy = slideText[currentSlide.id] ?? {
    title: `${currentSlide.title} ${currentSlide.highlight}`,
    description: currentSlide.description,
  };
  const visual = visualStyles[currentSlide.id] ?? visualStyles.discover;

  useEffect(() => {
    if (!didReset.current) {
      setIndex(0);
      didReset.current = true;
      return;
    }

    if (currentIndex >= totalSlides) {
      setIndex(0);
    }
  }, [currentIndex, totalSlides, setIndex]);

  const handleNext = () => {
    if (safeIndex < totalSlides - 1) {
      nextSlide();
    } else {
      setIndex(0); // Reset for next time
      router.push("/auth");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <div className="relative flex h-[43%] min-h-[282px] max-h-[360px] shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#ffdd3d_0%,#ffd51f_76%,#ffcf00_100%)] px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:repeating-linear-gradient(108deg,rgba(255,255,255,0.24)_0,rgba(255,255,255,0.24)_1px,transparent_1px,transparent_7px)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 34, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -34, scale: 0.98 }}
            transition={{ 
              opacity: { duration: 0.35 }, 
              x: { duration: 0.35 }, 
              scale: { duration: 0.35 }
            }}
            className={`relative z-10 ${visual.image}`}
          >
            <Image
              src={currentSlide.image}
              alt={currentSlide.alt}
              fill
              sizes="360px"
              className="object-contain object-center"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <section className="relative flex min-h-0 flex-1 flex-col bg-white px-[22px] pb-[max(1.35rem,env(safe-area-inset-bottom))] pt-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSlide.id}-copy`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[178px]"
          >
            <h1 className="max-w-[330px] text-left text-[29px] font-black leading-[1.12] text-[#111827]">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-[330px] text-left text-[16px] font-normal leading-[1.45] text-[#6b7280]">
              {copy.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-auto flex justify-center gap-2 pb-4 pt-4">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === safeIndex ? "w-2 bg-brand-yellow" : "w-2 bg-[#eef0f4]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="min-h-[54px] w-full rounded-[16px] border border-white/60 bg-[#ffd400] px-6 text-[16px] font-black text-white shadow-[0_10px_18px_rgba(255,204,0,0.24)] transition active:scale-[0.98]"
        >
          Next
        </button>
      </section>
    </div>
  );
}
