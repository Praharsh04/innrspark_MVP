import { Button } from "@/components/shared/Button";
import { Star, Zap, Target, BookOpen, AlertCircle } from "lucide-react";

export type CareerCardData = {
  title: string;
  matchScore: number;
  hook?: string;
  badges: string[];
  description?: string;
  reason: string;
  whyFit?: string;
  potentialChallenge: string;
  starterProject?: string;
  firstStep?: string;
};

type CareerCardProps = {
  career: CareerCardData;
  onProceed: () => void;
};

export function CareerCard({ career, onProceed }: CareerCardProps) {
  // Extended badges for demo purposes
  const allBadges = [...career.badges, "High Growth", "Modern Tech"];

  return (
    <article className="relative flex h-[620px] flex-col rounded-[32px] border border-charcoal/15 bg-white shadow-premium overflow-hidden">
      {/* Top Header Section with Title */}
      <div className="bg-brand-cream/50 px-7 pt-9 pb-7 border-b border-charcoal/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="relative z-10">
          <h2 className="text-[30px] font-black leading-[1.1] tracking-tight text-charcoal pr-4">
            {career.title}
          </h2>
          {career.hook && (
            <p className="mt-3 text-[16px] font-bold text-charcoal/40 italic leading-tight">
              &quot;{career.hook}&quot;
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2 relative z-10">
          {allBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-xl border border-charcoal/10 bg-white/80 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-charcoal/60 shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-7 pt-7 pb-4 space-y-8 no-scrollbar">
        {/* Description */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-brand-yellow" strokeWidth={3} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30">The Role</h3>
          </div>
          <p className="text-[16px] font-bold leading-relaxed text-charcoal/80">
            {career.reason}
          </p>
        </section>

        {/* Why You */}
        {career.whyFit && (
          <section className="bg-brand-yellow/5 rounded-2xl p-5 border border-brand-yellow/20">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-brand-yellow" strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/40">Why It Fits You</h3>
            </div>
            <p className="text-[14px] font-bold leading-relaxed text-charcoal/70">
              {career.whyFit}
            </p>
          </section>
        )}

        {/* Challenge */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={14} className="text-charcoal/20" strokeWidth={3} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30">Growth Mindset</h3>
          </div>
          <p className="text-[14px] font-bold leading-relaxed text-charcoal/50">
            {career.potentialChallenge}
          </p>
        </section>

        {/* Kickstart */}
        <section className="pt-2 pb-4">
          <div className="flex items-center gap-2 mb-5">
            <Star size={14} className="text-brand-yellow" strokeWidth={3} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-charcoal/30">Next Steps</h3>
          </div>
          
          <div className="space-y-4">
            {career.starterProject && (
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-charcoal/5 flex items-center justify-center">
                  <Zap size={18} className="text-charcoal/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest mb-1">Starter Project</p>
                  <p className="text-[14px] font-bold text-charcoal/70 leading-snug">{career.starterProject}</p>
                </div>
              </div>
            )}

            {career.firstStep && (
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-charcoal/5 flex items-center justify-center">
                  <BookOpen size={18} className="text-charcoal/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest mb-1">Expert Tip</p>
                  <p className="text-[14px] font-bold text-charcoal/70 leading-snug">{career.firstStep}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="px-7 pb-8 pt-5 bg-white border-t border-charcoal/5">
        <Button onClick={onProceed} className="min-h-[60px] text-[18px] font-black uppercase tracking-widest shadow-button rounded-2xl border border-charcoal/10 transition-all active:scale-[0.97] bg-brand-yellow text-charcoal">
          Select this path
        </Button>
      </div>
    </article>
  );
}
