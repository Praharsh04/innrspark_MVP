import { Button } from "@/components/shared/Button";

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
  const badges = career.badges.slice(0, 5);
  const whyFit = trimText(career.whyFit ?? career.reason, 190);

  return (
    <article className="relative flex min-h-[520px] flex-col overflow-hidden rounded-[32px] border border-charcoal/10 bg-white shadow-premium">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-20 translate-x-16 rounded-full bg-brand-yellow/15 blur-2xl" />

      <div className="relative z-10 flex flex-1 flex-col px-7 pb-6 pt-8">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-charcoal/30">Recommended path</p>
        <h2 className="mt-3 break-words text-[31px] font-black leading-[1.08] text-charcoal">
          {career.title}
        </h2>

        {career.hook && (
          <p className="mt-4 text-[16px] font-bold leading-snug text-charcoal/55">
            {trimText(career.hook, 92)}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-charcoal/8 bg-brand-yellow/12 px-3 py-1.5 text-[11px] font-black text-charcoal/65"
            >
              {badge}
            </span>
          ))}
        </div>

        <section className="mt-7 rounded-[24px] border border-charcoal/5 bg-brand-cream/70 p-5">
          <h3 className="text-[13px] font-black text-charcoal">Why this fits</h3>
          <p className="mt-3 text-[15px] font-bold leading-relaxed text-charcoal/62">
            {whyFit}
          </p>
        </section>

        <p className="mt-5 text-[13px] font-semibold leading-relaxed text-charcoal/42">
          Start small: {trimText(career.firstStep ?? career.starterProject ?? career.potentialChallenge, 120)}
        </p>
      </div>

      <div className="relative z-10 border-t border-charcoal/5 bg-white px-7 pb-7 pt-5">
        <Button onClick={onProceed} className="min-h-[56px] rounded-2xl border border-charcoal/10 bg-brand-yellow text-[16px] font-black text-charcoal shadow-button transition-all active:scale-[0.97]">
          Select This Path
        </Button>
      </div>
    </article>
  );
}

function trimText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trim()}...`;
}
