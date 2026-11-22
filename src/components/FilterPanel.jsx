import { RotateCcw } from 'lucide-react';
import { RATING_OPTIONS } from '../utils/products';
import { formatCategory } from '../utils/format';

const PRESETS = [
  { label: 'Under $25', min: '', max: '25' },
  { label: '$25 to $100', min: '25', max: '100' },
  { label: '$100 to $500', min: '100', max: '500' },
  { label: '$500+', min: '500', max: '' },
];

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-b-0">
      <legend className="mb-3 font-display text-sm font-semibold text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function FilterPanel({ filters, onChange, onClear, categories, totalCount, priceBounds, showCategory, activeCount }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={!activeCount}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark disabled:cursor-not-allowed disabled:text-muted/50"
        >
          <RotateCcw size={14} /> Clear all
        </button>
      </div>

      {showCategory && (
        <Group title="Category">
          <div className="-mx-1 max-h-64 space-y-0.5 overflow-y-auto px-1">
            <label className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm ${filters.category === 'all' ? 'bg-accent-soft font-semibold text-accent-dark' : 'text-ink-soft hover:bg-paper'}`}>
              <span className="flex items-center gap-2.5">
                <input type="radio" name="category" checked={filters.category === 'all'} onChange={() => onChange({ category: 'all' })} className="accent-accent" />
                All categories
              </span>
              <span className="text-xs text-muted">{totalCount}</span>
            </label>
            {categories.map(({ slug, count }) => (
              <label key={slug} className={`flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 text-sm ${filters.category === slug ? 'bg-accent-soft font-semibold text-accent-dark' : 'text-ink-soft hover:bg-paper'}`}>
                <span className="flex items-center gap-2.5">
                  <input type="radio" name="category" checked={filters.category === slug} onChange={() => onChange({ category: slug })} className="accent-accent" />
                  {formatCategory(slug)}
                </span>
                <span className="text-xs text-muted">{count}</span>
              </label>
            ))}
          </div>
        </Group>
      )}

      <Group title="Price (USD)">
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder={`Min ${priceBounds.min}`}
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="input"
            />
          </label>
          <span className="text-muted" aria-hidden="true">to</span>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              min="0"
              inputMode="decimal"
              placeholder={`Max ${priceBounds.max}`}
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="input"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const active = filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(active ? { minPrice: '', maxPrice: '' } : { minPrice: preset.min, maxPrice: preset.max })}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? 'border-accent bg-accent-soft text-accent-dark' : 'border-line text-ink-soft hover:border-ink-soft'}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Rating">
        <div className="space-y-0.5">
          {RATING_OPTIONS.map((option) => (
            <label key={option.value} className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm ${filters.minRating === option.value ? 'bg-accent-soft font-semibold text-accent-dark' : 'text-ink-soft hover:bg-paper'}`}>
              <input type="radio" name="rating" checked={filters.minRating === option.value} onChange={() => onChange({ minRating: option.value })} className="accent-accent" />
              {option.label}
            </label>
          ))}
        </div>
      </Group>
    </div>
  );
}
