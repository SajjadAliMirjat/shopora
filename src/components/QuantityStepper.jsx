import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ value, onDecrease, onIncrease, max, label = 'Quantity', size = 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-white" role="group" aria-label={label}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={`${box} grid place-items-center rounded-l-lg text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:bg-transparent`}
      >
        <Minus size={15} />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={typeof max === 'number' && value >= max}
        aria-label="Increase quantity"
        className={`${box} grid place-items-center rounded-r-lg text-ink transition-colors hover:bg-paper disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:bg-transparent`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
