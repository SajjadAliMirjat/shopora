import { formatPrice, getDiscountLabel, getSalePrice } from '../utils/format';

export default function Price({ product, size = 'md' }) {
  const sale = getSalePrice(product);
  const label = getDiscountLabel(product);
  const main = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-lg';
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-display font-bold tracking-tight text-ink ${main}`}>{formatPrice(sale)}</span>
      {label && (
        <>
          <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-xs font-semibold text-accent-dark">{label}</span>
        </>
      )}
    </div>
  );
}
