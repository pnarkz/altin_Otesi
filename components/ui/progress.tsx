export function Progress({
  value,
  className = "",
  indicatorClassName = ""
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ivory-100 ${className}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r from-gold-400 to-emerald-600 transition-all duration-500 ${indicatorClassName}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function CircularProgress({
  value,
  label
}: {
  value: number;
  label?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));
  const rotation = (safeValue / 100) * 360;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid h-28 w-28 place-items-center rounded-full"
        style={{
          background: `conic-gradient(#B8860B ${rotation}deg, rgba(212, 212, 212, 0.45) ${rotation}deg 360deg)`
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
          <span className="text-2xl font-medium text-ink-900">{Math.round(safeValue)}</span>
        </div>
      </div>
      {label ? <span className="text-sm text-muted-500">{label}</span> : null}
    </div>
  );
}
