"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useAssessmentStore, nextQuestion } from "@/store/useAssessmentStore";
import { mockQuestions } from "@/data/mockQuestions";
import { OptionButton } from "@/components/assessment/OptionButton";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { AssessmentOptionKey } from "@/types/assessment";

const DEMO_QUESTION_LIMIT = 10;
const demoQuestions = mockQuestions.slice(0, DEMO_QUESTION_LIMIT);

export default function AssessmentQuestionPage() {
  const router = useRouter();
  const { currentQuestionIndex, answerQuestion, completeAssessment, isComplete } = useAssessmentStore();

  const [selectedKey, setSelectedKey] = useState<AssessmentOptionKey | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = demoQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / demoQuestions.length) * 100;

  useEffect(() => {
    if (isComplete) {
      router.push("/assessment/loading");
    }
  }, [isComplete, router]);

  const handleSelect = (key: string) => {
    if (isTransitioning) return;

    const optionKey = key as AssessmentOptionKey;
    setSelectedKey(optionKey);
    setIsTransitioning(true);

    // Save answer
    answerQuestion(currentQuestion.id, optionKey);

    // 1 second delay before moving to next question
    setTimeout(() => {
      const { isComplete: completeAfterAnswer } = useAssessmentStore.getState();
      const isLastDemoQuestion = currentQuestionIndex >= demoQuestions.length - 1;

      if (completeAfterAnswer || isLastDemoQuestion) {
        if (!completeAfterAnswer) {
          completeAssessment();
        }

        router.push("/assessment/loading");
      } else {
        nextQuestion();
        setSelectedKey(null);
        setIsTransitioning(false);
      }
    }, 1000);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      useAssessmentStore.setState((state) => ({
        currentQuestionIndex: state.currentQuestionIndex - 1
      }));
    } else {
      router.push("/assessment/start");
    }
  };

  if (!currentQuestion) return null;

  return (
    <MobileShell>
      <div className="flex h-full flex-col px-[18px] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[58px]">
        <div className="flex items-center gap-5 pb-3">
          <button 
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal transition active:scale-95"
            aria-label="Go back"
          >
            <ChevronLeft className="h-7 w-7 text-charcoal" strokeWidth={2.2} />
          </button>
          <div className="flex-1">
            <ProgressBar value={progress} />
          </div>
        </div>

        <div className="mt-[26px] min-h-0 flex-1 overflow-y-auto rounded-[28px] border border-charcoal/30 bg-white/75 px-[13px] pb-8 pt-[14px] shadow-none">
          <div className="flex h-full min-h-0 flex-col">
            <QuestionCard question={currentQuestion} />
            
            <div className="mt-9 flex flex-col gap-[26px] px-[10px] pb-6">
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.key}
                  option={option}
                  isSelected={selectedKey === option.key}
                  onSelect={handleSelect}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
