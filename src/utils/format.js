const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value) => currency.format(Number.isFinite(value) ? value : 0);

export const formatCategory = (slug = '') =>
  slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const roundMoney = (value) => Math.round(value * 100) / 100;

/** Price after discount. */
export const getSalePrice = (product) =>
  roundMoney(product.price * (1 - (product.discountPercentage || 0) / 100));

export const getDiscountLabel = (product) => {
  const pct = Math.round(product.discountPercentage || 0);
  return pct >= 1 ? `${pct}% off` : null;
};

export const formatDate = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const getStockInfo = (stock) => {
  if (!stock || stock <= 0) return { label: 'Out of stock', tone: 'danger', available: false };
  if (stock <= 10) return { label: `Only ${stock} left`, tone: 'warn', available: true };
  return { label: 'In stock', tone: 'success', available: true };
};
