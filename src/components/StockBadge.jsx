import { getStockInfo } from '../utils/format';

const TONES = {
  success: 'text-success',
  warn: 'text-amber-700',
  danger: 'text-danger',
};
const DOTS = {
  success: 'bg-success',
  warn: 'bg-amber-500',
  danger: 'bg-danger',
};

export default function StockBadge({ stock }) {
  const info = getStockInfo(stock);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${TONES[info.tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[info.tone]}`} aria-hidden="true" />
      {info.label}
    </span>
  );
}
