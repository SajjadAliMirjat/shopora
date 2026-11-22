import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { useToast } from '../context/ToastContext';
import ProductGrid from '../components/ProductGrid';
import ProductSkeletonGrid from '../components/ProductSkeleton';
import SectionHeader from '../components/SectionHeader';
import ImageWithFallback from '../components/ImageWithFallback';
import RecentlyViewed from '../components/RecentlyViewed';
import OfflineNotice from '../components/OfflineNotice';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import usePageTitle from '../hooks/usePageTitle';
import { formatCategory, formatPrice, getSalePrice } from '../utils/format';
import { getCategories } from '../utils/products';

const PERKS = [
  { icon: Truck, title: 'Free shipping over $100', text: 'A flat $7.99 on smaller orders.' },
  { icon: RotateCcw, title: '30-day returns', text: 'Changed your mind? Send it back.' },
  { icon: ShieldCheck, title: 'Secure by design', text: 'Your cart stays saved on this device.' },
];

function HeroTile({ product, className }) {
  if (!product) return <div className={`skeleton ${className}`} aria-hidden="true" />;
  return (
    <Link to={`/product/${product.id}`} className={`group relative block overflow-hidden bg-white ring-1 ring-line ${className}`}>
      <ImageWithFallback src={product.thumbnail} alt={product.title} loading="eager" className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105" />
      <span className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-white/95 px-3 py-2 text-sm shadow-card backdrop-blur">
        <span className="line-clamp-1 font-medium text-ink">{product.title}</span>
        <span className="shrink-0 font-semibold text-accent-dark">{formatPrice(getSalePrice(product))}</span>
      </span>
    </Link>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { notify } = useToast();

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address, like name@example.com.');
      return;
    }
    setError('');
    setEmail('');
    notify('You are subscribed. Watch your inbox for new arrivals.');
  };

  return (
    <section className="container-x mt-24" aria-labelledby="news-title">
      <div className="grid items-center gap-8 rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 md:grid-cols-2">
        <div>
          <h2 id="news-title" className="font-display text-3xl font-bold tracking-tight">New arrivals, once a month.</h2>
          <p className="mt-3 max-w-md text-white/70">Get a short note when we add products worth your attention. No spam, unsubscribe anytime.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
              className="input h-12 flex-1 border-transparent"
            />
            <button type="submit" className="btn h-12 bg-white px-6 text-ink hover:bg-paper">Subscribe</button>
          </div>
          {error && <p id="newsletter-error" className="mt-2 text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle('');
  const { products, loading } = useProducts();
  const { items: recent } = useRecentlyViewed();

  const topRated = useMemo(
    () => [...products].filter((p) => p.stock > 0).sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );
  const deals = useMemo(
    () => [...products].filter((p) => p.stock > 0).sort((a, b) => b.discountPercentage - a.discountPercentage).slice(0, 4),
    [products]
  );
  const categories = useMemo(() => getCategories(products).slice(0, 8), [products]);
  const heroProducts = topRated.slice(0, 3);

  return (
    <>
      <section className="container-x pt-10 sm:pt-16" aria-labelledby="hero-title">
        <OfflineNotice />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <h1 id="hero-title" className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl xl:text-7xl">
              Everyday objects, chosen well.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Beauty, fragrance, furniture and pantry staples from brands we trust, with honest prices and free shipping on orders over $100.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn btn-primary h-12 px-7 text-base">Shop all products <ArrowRight size={18} /></Link>
              <a href="#categories" className="btn btn-outline h-12 px-7 text-base">Browse categories</a>
            </div>
          </div>

          <div className="grid grid-cols-5 grid-rows-2 gap-4" aria-label="Top rated picks">
            <HeroTile product={heroProducts[0]} className="col-span-3 row-span-2 aspect-[3/4] rounded-[2rem] sm:aspect-auto sm:min-h-[26rem]" />
            <HeroTile product={heroProducts[1]} className="col-span-2 aspect-square rounded-2xl" />
            <HeroTile product={heroProducts[2]} className="col-span-2 aspect-square rounded-tl-[2.5rem] rounded-br-2xl rounded-bl-2xl rounded-tr-2xl" />
          </div>
        </div>

        <ul className="mt-16 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent-dark"><Icon size={19} aria-hidden="true" /></span>
              <div>
                <p className="font-display font-semibold text-ink">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="categories" className="container-x mt-20 scroll-mt-24" aria-labelledby="cat-title">
        <div id="cat-title"><SectionHeader title="Shop by category" description="Start with what you need today." to="/shop" linkLabel="All products" /></div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4" role="status" aria-label="Loading categories">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map(({ slug, count }) => {
              const sample = products.find((p) => p.category === slug);
              return (
                <li key={slug}>
                  <Link to={`/category/${slug}`} className="group flex h-full items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-shadow hover:shadow-card">
                    <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                      <ImageWithFallback src={sample?.thumbnail} alt="" className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display font-semibold text-ink">{formatCategory(slug)}</span>
                      <span className="text-sm text-muted">{count} {count === 1 ? 'product' : 'products'}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="container-x mt-24" aria-labelledby="top-title">
        <div id="top-title"><SectionHeader title="Top rated right now" description="The products customers rate highest." to="/shop?sort=rating" linkLabel="See all" /></div>
        {loading ? <ProductSkeletonGrid count={8} /> : <ProductGrid products={topRated} />}
      </section>

      <section className="container-x mt-24" aria-labelledby="deals-title">
        <div id="deals-title"><SectionHeader title="Biggest savings" description="Our deepest discounts, while stock lasts." /></div>
        {loading ? <ProductSkeletonGrid count={4} /> : <ProductGrid products={deals} />}
      </section>

      <RecentlyViewed items={recent} />
      <Newsletter />
    </>
  );
}
