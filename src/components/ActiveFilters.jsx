import { X } from 'lucide-react';
import { formatCategory } from '../utils/format';

export default function ActiveFilters({ chips, onRemove, onClear }) {
  if (!chips.length) return null;
  return (
    <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <span key={chip.key} className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft py-1 pl-3 pr-1.5 text-sm font-medium text-accent-dark">
          {chip.value ? `${chip.label}: ${formatCategory(chip.value)}` : chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            aria-label={`Remove filter ${chip.label}`}
            className="grid h-5 w-5 place-items-center rounded-full hover:bg-accent/15"
          >
            <X size={13} />
          </button>
        </span>
      ))}
      <button type="button" onClick={onClear} className="px-2 text-sm font-medium text-muted underline-offset-2 hover:text-ink hover:underline">
        Clear all
      </button>
    </div>
  );
}
