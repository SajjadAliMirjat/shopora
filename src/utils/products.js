import { getSalePrice } from './format';

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

export const RATING_OPTIONS = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4 stars & up' },
  { value: 3, label: '3 stars & up' },
  { value: 2, label: '2 stars & up' },
];

export const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  sort: 'featured',
};

const toNumber = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export function filterProducts(products, filters) {
  const query = filters.search.trim().toLowerCase();
  const min = toNumber(filters.minPrice);
  const max = toNumber(filters.maxPrice);

  return products.filter((product) => {
    if (query) {
      const haystack = [product.title, product.description, product.brand, ...(product.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.category !== 'all' && product.category !== filters.category) return false;

    const price = getSalePrice(product);
    if (min !== null && price < min) return false;
    if (max !== null && price > max) return false;
    if (filters.minRating && product.rating < filters.minRating) return false;
    return true;
  });
}

export function sortProducts(products, sort) {
  const list = [...products];
  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => getSalePrice(a) - getSalePrice(b));
    case 'price-desc':
      return list.sort((a, b) => getSalePrice(b) - getSalePrice(a));
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating);
    default:
      return list;
  }
}

export function getActiveFilters(filters, { lockedCategory } = {}) {
  const chips = [];
  if (filters.search.trim()) chips.push({ key: 'search', label: `Search: "${filters.search.trim()}"` });
  if (!lockedCategory && filters.category !== 'all') chips.push({ key: 'category', label: 'Category', value: filters.category });
  const min = toNumber(filters.minPrice);
  const max = toNumber(filters.maxPrice);
  if (min !== null) chips.push({ key: 'minPrice', label: `Min $${min}` });
  if (max !== null) chips.push({ key: 'maxPrice', label: `Max $${max}` });
  if (filters.minRating) chips.push({ key: 'minRating', label: `${filters.minRating}+ stars` });
  return chips;
}

export function getCategories(products) {
  const counts = new Map();
  products.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug));
}

export function getPriceBounds(products) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map(getSalePrice);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

/** Small, serialisable copy of a product for cart / wishlist / recently viewed. */
export const toSnapshot = (p) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  category: p.category,
  brand: p.brand,
  price: p.price,
  discountPercentage: p.discountPercentage,
  rating: p.rating,
  stock: p.stock,
  thumbnail: p.thumbnail,
});
