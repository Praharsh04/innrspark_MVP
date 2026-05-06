"use client";

import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/MobileShell";
import { PillButton } from "@/components/ui/PillButton";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function AssessmentStartPage() {
  const router = useRouter();
  const startAssessment = useAssessmentStore((state) => state.startAssessment);

  const handleStart = () => {
    startAssessment();
    router.push("/assessment/question");
  };

  return (
    <MobileShell>
      <div className="flex min-h-dvh flex-col px-[15px] pb-[max(2.25rem,env(safe-area-inset-bottom))] pt-[31vh] text-center">
        <h1 className="text-[25px] font-black leading-tight text-charcoal">
            Let’s start your journey
        </h1>

        <p className="mx-auto mt-auto max-w-[276px] text-[16px] font-medium leading-[1.45] text-charcoal/55">
          Takes just 10–15 minutes to figure out what works for you
        </p>

        <div className="mt-11">
          <PillButton onClick={handleStart} className="min-h-[51px] text-[16px] font-semibold shadow-button">
            Start Assessment
          </PillButton>
        </div>
      </div>
    </MobileShell>
  );
}
