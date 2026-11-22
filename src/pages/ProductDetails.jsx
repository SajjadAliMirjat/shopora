import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CloudOff, Heart, RotateCcw, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { fetchProductById, getFallbackProduct } from '../services/api';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ImageWithFallback from '../components/ImageWithFallback';
import Rating from '../components/Rating';
import Price from '../components/Price';
import StockBadge from '../components/StockBadge';
import QuantityStepper from '../components/QuantityStepper';
import ProductGrid from '../components/ProductGrid';
import ErrorState from '../components/ErrorState';
import RecentlyViewed from '../components/RecentlyViewed';
import SectionHeader from '../components/SectionHeader';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import usePageTitle from '../hooks/usePageTitle';
import { formatCategory, formatDate, getStockInfo } from '../utils/format';

function DetailsSkeleton() {
  return (
    <div className="container-x py-10" role="status" aria-label="Loading product">
      <div className="skeleton mb-8 h-4 w-64 rounded" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="skeleton aspect-square rounded-3xl" />
        <div className="space-y-5">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-10 w-3/4 rounded" />
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-9 w-48 rounded" />
          <div className="skeleton h-24 w-full rounded" />
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', product: null, offline: false, error: '' });
  const [attempt, setAttempt] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { products } = useProducts();
  const { addToCart, getQuantity } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { items: recent, add: addRecent } = useRecentlyViewed();

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', product: null, offline: false, error: '' });
    setActiveImage(0);
    setQuantity(1);

    fetchProductById(id, controller.signal)
      .then((product) => setState({ status: 'success', product, offline: false, error: '' }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        const local = getFallbackProduct(id);
        if (local) setState({ status: 'success', product: local, offline: true, error: err.message });
        else setState({ status: 'error', product: null, offline: false, error: err.message, notFound: err.status === 404 });
      });

    return () => controller.abort();
  }, [id, attempt]);

  const { product } = state;
  usePageTitle(product?.title || 'Product');

  useEffect(() => {
    if (product) addRecent(product);
  }, [product, addRecent]);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);

  if (state.status === 'loading') return <DetailsSkeleton />;

  if (state.status === 'error') {
    return (
      <div className="container-x py-16">
        <ErrorState
          title={state.notFound ? 'Product not found' : 'We could not load this product'}
          message={state.notFound ? 'This product may have been removed or the link is incorrect.' : state.error}
          onRetry={state.notFound ? undefined : () => setAttempt((n) => n + 1)}
        >
          <Link to="/shop" className="btn btn-outline">Back to shop</Link>
        </ErrorState>
      </div>
    );
  }

  const { available } = getStockInfo(product.stock);
  const inCart = getQuantity(product.id);
  const remaining = Math.max(0, product.stock - inCart);
  const wished = isWishlisted(product.id);
  const images = product.images.length ? product.images : [product.thumbnail];
  const reviews = product.reviews || [];

  return (
    <div className="pb-4">
      <div className="container-x py-8 sm:py-10">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: formatCategory(product.category), to: `/category/${product.category}` },
            { label: product.title },
          ]}
        />

        {state.offline && (
          <div role="status" className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <CloudOff size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="flex-1">Showing saved product details because the live catalogue is unavailable.</p>
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className="font-semibold underline underline-offset-2">Retry</button>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="aspect-square overflow-hidden rounded-3xl border border-line bg-white">
              <ImageWithFallback src={images[activeImage]} alt={product.title} loading="eager" className="h-full w-full object-contain p-8" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.slice(0, 6).map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1} of ${Math.min(images.length, 6)}`}
                    aria-current={i === activeImage}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-white transition-colors ${i === activeImage ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-ink-soft'}`}
                  >
                    <ImageWithFallback src={src} alt="" className="h-full w-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-medium text-muted">
                {product.brand ? `${product.brand} · ` : ''}
                <Link to={`/category/${product.category}`} className="hover:text-accent">{formatCategory(product.category)}</Link>
              </p>
              <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{product.title}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Rating value={product.rating} count={reviews.length || undefined} size={16} />
              <StockBadge stock={product.stock} />
            </div>

            <Price product={product} size="lg" />
            <p className="max-w-prose leading-relaxed text-ink-soft">{product.description}</p>

            <div className="flex flex-wrap items-center gap-3 border-y border-line py-5">
              {available && remaining > 0 && (
                <QuantityStepper
                  value={Math.min(quantity, remaining)}
                  max={remaining}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                  onIncrease={() => setQuantity((q) => Math.min(remaining, q + 1))}
                />
              )}
              <button
                type="button"
                disabled={!available || remaining === 0}
                onClick={() => {
                  if (addToCart(product, Math.min(quantity, remaining))) setQuantity(1);
                }}
                className="btn btn-primary h-11 min-w-44 flex-1 sm:flex-none"
              >
                <ShoppingBag size={17} />
                {!available ? 'Out of stock' : remaining === 0 ? 'Maximum in cart' : 'Add to cart'}
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-pressed={wished}
                className={`btn h-11 border ${wished ? 'border-danger bg-danger text-white hover:bg-danger/90' : 'border-line bg-white text-ink hover:bg-paper'}`}
              >
                <Heart size={17} fill={wished ? 'currentColor' : 'none'} /> {wished ? 'Saved' : 'Save'}
              </button>
            </div>
            {inCart > 0 && (
              <p className="-mt-2 text-sm text-muted">
                {inCart} in your cart. <Link to="/cart" className="font-semibold text-accent hover:text-accent-dark">Go to cart</Link>
              </p>
            )}

            <ul className="grid gap-3 text-sm sm:grid-cols-3">
              <li className="flex items-start gap-2.5 rounded-xl bg-white p-3 ring-1 ring-line">
                <Truck size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span><span className="block font-semibold text-ink">Shipping</span><span className="text-muted">{product.shippingInformation || 'Ships in 3-5 business days'}</span></span>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-white p-3 ring-1 ring-line">
                <RotateCcw size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span><span className="block font-semibold text-ink">Returns</span><span className="text-muted">{product.returnPolicy || '30 days return policy'}</span></span>
              </li>
              <li className="flex items-start gap-2.5 rounded-xl bg-white p-3 ring-1 ring-line">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <span><span className="block font-semibold text-ink">Warranty</span><span className="text-muted">{product.warrantyInformation || 'No warranty'}</span></span>
              </li>
            </ul>

            {(product.sku || product.tags.length > 0) && (
              <dl className="space-y-2 text-sm">
                {product.sku && (
                  <div className="flex gap-2"><dt className="text-muted">SKU</dt><dd className="font-medium text-ink">{product.sku}</dd></div>
                )}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <dt className="text-muted">Tags</dt>
                    {product.tags.map((t) => (
                      <dd key={t}><Link to={`/shop?q=${encodeURIComponent(t)}`} className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink-soft ring-1 ring-line hover:bg-white">{t}</Link></dd>
                    ))}
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </div>

      <section className="container-x mt-8" aria-labelledby="reviews-title">
        <h2 id="reviews-title" className="font-display text-2xl font-bold tracking-tight">Customer reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 text-muted">No reviews yet for this product.</p>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((r, i) => (
              <li key={`${r.reviewerName}-${i}`} className="rounded-2xl border border-line bg-white p-5">
                <Rating value={r.rating} />
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.comment}</p>
                <p className="mt-4 text-xs text-muted">{r.reviewerName}{r.date ? ` · ${formatDate(r.date)}` : ''}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="container-x mt-20" aria-labelledby="related-title">
          <div id="related-title"><SectionHeader title="You might also like" to={`/category/${product.category}`} linkLabel={`More ${formatCategory(product.category)}`} /></div>
          <ProductGrid products={related} />
        </section>
      )}

      <RecentlyViewed items={recent} excludeId={product.id} />
    </div>
  );
}
