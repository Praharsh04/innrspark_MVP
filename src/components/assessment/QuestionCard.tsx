"use client";

import { AssessmentQuestion } from "@/types/assessment";

type QuestionCardProps = {
  question: AssessmentQuestion;
};

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="flex min-h-[212px] items-center rounded-[28px] border border-charcoal/20 bg-brand-softYellow/55 px-5 py-8">
      <h2 className="max-w-[310px] text-[23px] font-black leading-[1.2] text-charcoal">
        {question.text}
      </h2>
    </div>
  );
}
