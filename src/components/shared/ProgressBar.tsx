type ProgressBarProps = {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
};

export function ProgressBar({ value, label, showValue = false, className = "" }: ProgressBarProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-brand-muted">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(normalizedValue)}%</span>}
        </div>
      )}
      <div
        className="h-3 w-full overflow-hidden rounded-pill bg-brand-black/[0.08]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalizedValue}
      >
        <div
          className="h-full rounded-pill bg-gradient-to-r from-brand-gold to-brand-yellow transition-all duration-500"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  );
}
