"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockCareers } from "@/data/mockCareers";
import { useRecommendationStore } from "@/store/useRecommendationStore";
import type { CareerRecommendation } from "@/types/career";
import type { Recommendation } from "@/lib/recommendations/types";
import { CareerCard, type CareerCardData } from "./CareerCard";

type RichMockCareer = (typeof mockCareers)[number];
type DisplayCareer = CareerRecommendation | Recommendation | RichMockCareer;

function getCareerId(career: DisplayCareer) {
  return "careerId" in career ? career.careerId : career.id;
}

function getCareerReason(career: DisplayCareer) {
  if ("whyFit" in career && career.whyFit) {
    return career.whyFit;
  }

  if ("reason" in career && career.reason) {
    return career.reason;
  }

  return "Your responses suggest this path may fit how you like to think, learn, and solve problems.";
}

function toCareerCardData(career: DisplayCareer): CareerCardData {
  const id = getCareerId(career);
  const richCareer = mockCareers.find((item) => item.id === id);
  const badges = [...new Set([...(career.badges ?? []), ...(richCareer?.badges ?? [])])].slice(0, 3);

  return {
    title: career.title,
    matchScore: career.matchScore,
    hook:
      ("hook" in career ? career.hook : undefined) ??
      richCareer?.hook ??
      "A practical career path worth exploring.",
    badges,
    reason:
      ("reason" in career ? career.reason : undefined) ??
      richCareer?.reason ??
      "This role combines decision-making, problem solving, and communication in a way that can grow with your strengths.",
    description:
      ("description" in career ? career.description : undefined) ??
      richCareer?.description ??
      "This role combines decision-making, problem solving, and communication in a way that can grow with your strengths.",
    whyFit: getCareerReason(career),
    potentialChallenge:
      career.potentialChallenge ??
      richCareer?.potentialChallenge ??
      "The early learning curve may feel broad, so start with one focused project at a time.",
    starterProject:
      ("starterProject" in career ? career.starterProject : undefined) ??
      richCareer?.starterProject ??
      "Create a one-page case study about a product, process, or experience you would improve.",
    firstStep:
      ("firstStep" in career ? career.firstStep : undefined) ??
      richCareer?.firstStep ??
      "Spend 20 minutes researching the role and write down three skills you want to build first.",
  };
}

export function RecommendationDeck() {
  const router = useRouter();
  const { currentIndex, setCurrentIndex, selectCareer, recommendations } = useRecommendationStore();
  
  const displayCareers: DisplayCareer[] = recommendations.length > 0 ? recommendations : mockCareers;
  const career = displayCareers[currentIndex] || displayCareers[0];
  const cardCareer = toCareerCardData(career);

  function move(direction: -1 | 1) {
    setCurrentIndex((currentIndex + direction + displayCareers.length) % displayCareers.length);
  }

  function proceed() {
    const id = getCareerId(career);
    selectCareer(id);
    router.push("/roadmap/generating");
  }

  return (
    <div className="flex h-full flex-col px-screen pb-[max(2rem,env(safe-area-inset-bottom))] pt-12 text-center bg-brand-cream">
      <div className="mb-8">
        <h1 className="text-[32px] font-black tracking-tight text-charcoal leading-none">Paths That Fit You</h1>
        <p className="mt-2 text-[14px] font-black uppercase tracking-[0.25em] text-charcoal/30">DISCOVER YOUR FUTURE</p>
      </div>

      <div className="flex justify-center gap-1.5 mb-6">
        {displayCareers.slice(0, 10).map((item, index) => (
          <button
            key={getCareerId(item)}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-8 bg-brand-yellow shadow-sm" : "w-1.5 bg-charcoal/10"
            }`}
          />
        ))}
        {displayCareers.length > 10 && <span className="text-[10px] font-black text-charcoal/20">+{displayCareers.length - 10}</span>}
      </div>

      <div className="relative mt-2 flex-1">
        {/* Background Overlays */}
        <div className="absolute inset-x-[12px] top-10 h-[580px] rounded-[32px] border border-charcoal/5 bg-charcoal/5 -rotate-1" />
        <div className="absolute inset-x-[6px] top-5 h-[600px] rounded-[32px] border border-charcoal/10 bg-white/40 rotate-1" />
        
        <motion.div
          key={getCareerId(career)}
          className="absolute inset-x-0 top-0 cursor-grab active:cursor-grabbing z-10"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          initial={{ opacity: 0, y: 20, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -15, scale: 0.95, rotate: 2 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 80) {
              move(-1);
            } else if (info.offset.x < -80) {
              move(1);
            }
          }}
        >
          <CareerCard career={cardCareer} onProceed={proceed} />
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-between text-charcoal px-4">
        <button
          type="button"
          aria-label="Previous career"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white border border-charcoal/10 shadow-sm transition active:scale-90"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/40">Swipe to Explore</span>
          <span className="text-[13px] font-black text-charcoal mt-0.5">{currentIndex + 1} / {displayCareers.length}</span>
        </div>
        <button
          type="button"
          aria-label="Next career"
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white border border-charcoal/10 shadow-sm transition active:scale-90"
          onClick={() => move(1)}
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
