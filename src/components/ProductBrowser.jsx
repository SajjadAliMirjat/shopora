import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDownUp, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import FilterDrawer from './FilterDrawer';
import ActiveFilters from './ActiveFilters';
import ProductGrid from './ProductGrid';
import ProductSkeletonGrid from './ProductSkeleton';
import EmptyState from './EmptyState';
import useDebounce from '../hooks/useDebounce';
import {
  DEFAULT_FILTERS,
  PAGE_SIZE,
  SORT_OPTIONS,
  filterProducts,
  getActiveFilters,
  getCategories,
  getPriceBounds,
  sortProducts,
} from '../utils/products';

const GRID = 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';

/**
 * Shared listing used by the Shop page and the Category page.
 * Filter state lives here (local state); the cart/wishlist live in context.
 */
export default function ProductBrowser({ products, loading, lockedCategory = null }) {
  const location = useLocation();
  const urlQuery = useMemo(() => new URLSearchParams(location.search).get('q') || '', [location.search]);

  const urlSort = useMemo(() => {
    const value = new URLSearchParams(location.search).get('sort');
    return SORT_OPTIONS.some((o) => o.value === value) ? value : DEFAULT_FILTERS.sort;
  }, [location.search]);

  const baseFilters = useMemo(
    () => ({ ...DEFAULT_FILTERS, category: lockedCategory || 'all' }),
    [lockedCategory]
  );

  const [filters, setFilters] = useState({ ...baseFilters, search: urlQuery, sort: urlSort });
  const [searchText, setSearchText] = useState(urlQuery);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debouncedSearch = useDebounce(searchText, 250);

  // A fresh navigation (e.g. header search, or switching category) starts a fresh state.
  useEffect(() => {
    setFilters({ ...baseFilters, search: urlQuery, sort: urlSort });
    setSearchText(urlQuery);
    setVisible(PAGE_SIZE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, baseFilters]);

  // Apply the debounced search box to the filters.
  useEffect(() => {
    setFilters((f) => (f.search === debouncedSearch ? f : { ...f, search: debouncedSearch }));
    setVisible(PAGE_SIZE);
  }, [debouncedSearch]);

  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setVisible(PAGE_SIZE);
  };

  const clearAll = () => {
    setFilters(baseFilters);
    setSearchText('');
    setVisible(PAGE_SIZE);
  };

  const removeChip = (key) => {
    if (key === 'search') {
      setSearchText('');
      updateFilters({ search: '' });
    } else {
      updateFilters({ [key]: DEFAULT_FILTERS[key] });
    }
  };

  const scoped = useMemo(
    () => (lockedCategory ? products.filter((p) => p.category === lockedCategory) : products),
    [products, lockedCategory]
  );
  const categories = useMemo(() => getCategories(products), [products]);
  const priceBounds = useMemo(() => getPriceBounds(scoped), [scoped]);

  const results = useMemo(
    () => sortProducts(filterProducts(products, filters), filters.sort),
    [products, filters]
  );
  const shown = results.slice(0, visible);
  const chips = getActiveFilters(filters, { lockedCategory });

  const panelProps = {
    filters,
    onChange: updateFilters,
    onClear: clearAll,
    categories,
    totalCount: products.length,
    priceBounds,
    showCategory: !lockedCategory,
    activeCount: chips.length,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
          <FilterPanel {...panelProps} />
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by name or description"
              aria-label="Search products"
              className="input h-11 pl-10 pr-10"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => {
                  setSearchText('');
                  updateFilters({ search: '' });
                }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-paper hover:text-ink"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDrawerOpen(true)} className="btn btn-outline h-11 flex-1 lg:hidden sm:flex-none">
              <SlidersHorizontal size={16} /> Filters
              {chips.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-white">{chips.length}</span>}
            </button>
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Sort products</span>
              <ArrowDownUp size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
              <select value={filters.sort} onChange={(e) => updateFilters({ sort: e.target.value })} className="input h-11 appearance-none pl-9 pr-8 sm:w-52">
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <ActiveFilters chips={chips} onRemove={removeChip} onClear={clearAll} />

        <p className="mb-5 text-sm text-muted" aria-live="polite">
          {loading ? 'Loading products…' : (
            <>
              <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'product' : 'products'} found
              {results.length > shown.length && <> · showing {shown.length}</>}
            </>
          )}
        </p>

        {loading ? (
          <ProductSkeletonGrid count={9} className={GRID} />
        ) : results.length === 0 ? (
          <EmptyState icon={SearchX} title="No products match your filters" message="Try a different search term, widen the price range, or remove a filter.">
            <button type="button" onClick={clearAll} className="btn btn-primary">
              Clear all filters
            </button>
          </EmptyState>
        ) : (
          <>
            <ProductGrid products={shown} className={GRID} />
            {results.length > shown.length && (
              <div className="mt-10 flex flex-col items-center gap-2">
                <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-outline px-8">
                  Load more products
                </button>
                <span className="text-xs text-muted">
                  {shown.length} of {results.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {drawerOpen && <FilterDrawer onClose={() => setDrawerOpen(false)} resultCount={results.length} {...panelProps} />}
    </div>
  );
}
