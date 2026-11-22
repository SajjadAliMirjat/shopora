import { Star } from 'lucide-react';

export default function Rating({ value = 0, count, size = 14 }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className="inline-flex items-center gap-1.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-line">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        <span className="absolute inset-y-0 left-0 flex overflow-hidden text-star" style={{ width: `${percent}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="shrink-0" />
          ))}
        </span>
      </span>
      <span className="text-xs font-semibold text-ink">{value.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-xs text-muted">({count})</span>}
    </div>
  );
}
