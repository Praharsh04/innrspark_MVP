import { Button } from "@/components/shared/Button";
import { Star, Zap, Target, BookOpen, AlertCircle } from "lucide-react";

export type CareerCardData = {
  title: string;
  matchScore: number;
  hook?: string;
  badges: string[];
  description: string;
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
  return (
    <article className="relative flex h-[620px] flex-col rounded-[32px] border border-charcoal/15 bg-white shadow-premium overflow-hidden">
      {/* Top Header Section with Title & Score */}
      <div className="bg-brand-cream/50 px-7 pt-8 pb-6 border-b border-charcoal/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 pr-4">
            <h2 className="text-[28px] font-black leading-[1.1] tracking-tight text-charcoal break-words">
              {career.title}
            </h2>
            {career.hook && (
              <p className="mt-2 text-[15px] font-bold text-charcoal/40 italic leading-tight">
                &quot;{career.hook}&quot;
              </p>
            )}
          </div>
          <div className="flex flex-col items-center shrink-0">
            <div className="h-14 w-14 rounded-2xl bg-charcoal flex flex-col items-center justify-center shadow-lg border border-white/10 ring-1 ring-charcoal/5">
              <span className="text-[18px] font-black text-brand-yellow leading-none">{career.matchScore}%</span>
              <span className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">Match</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 relative z-10">
          {career.badges.map((badge) => (
            <span
              key={badge}
              className="max-w-full truncate rounded-xl border border-charcoal/10 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-charcoal shadow-sm"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content Section - Scrollable */}
      <div className="flex-1 overflow-y-auto px-7 pt-6 pb-4 space-y-7 no-scrollbar">
        {/* Description */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-brand-yellow" strokeWidth={3} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">The Vibe</h3>
          </div>
          <p className="text-[15px] font-bold leading-relaxed text-charcoal/80">
            {career.description}
          </p>
        </section>

        {/* Why You */}
        {career.whyFit && (
          <section className="bg-brand-softYellow/30 rounded-2xl p-4 border border-brand-yellow/20 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} className="text-brand-yellow" strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/40">Why It Fits You</h3>
            </div>
            <p className="text-[14px] font-bold leading-relaxed text-charcoal/70">
              {career.whyFit}
            </p>
          </section>
        )}

        {/* Challenge */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-charcoal/20" strokeWidth={3} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">The Reality</h3>
          </div>
          <p className="text-[14px] font-bold leading-relaxed text-charcoal/50">
            {career.potentialChallenge}
          </p>
        </section>

        {/* Kickstart */}
        {(career.starterProject || career.firstStep) && (
          <section className="pt-2">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-brand-yellow" strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">Kickstart</h3>
            </div>
            
            {career.starterProject && (
              <div className="flex gap-3 mb-4">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-charcoal/5 flex items-center justify-center">
                  <Zap size={16} className="text-charcoal/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest leading-none mb-1">Starter Project</p>
                  <p className="text-[13px] font-bold text-charcoal/70 leading-tight">{career.starterProject}</p>
                </div>
              </div>
            )}

            {career.firstStep && (
              <div className="flex gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-charcoal/5 flex items-center justify-center">
                  <BookOpen size={16} className="text-charcoal/40" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-charcoal/30 tracking-widest leading-none mb-1">First Step</p>
                  <p className="text-[13px] font-bold text-charcoal/70 leading-tight">{career.firstStep}</p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-7 pb-8 pt-4 bg-white">
        <Button onClick={onProceed} className="min-h-[58px] text-[18px] font-black uppercase tracking-wider shadow-button rounded-2xl border border-charcoal/10 transition-all active:scale-[0.97]">
          Proceed
        </Button>
      </div>
    </article>
  );
}
