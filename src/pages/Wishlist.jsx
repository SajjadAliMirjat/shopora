import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import ImageWithFallback from '../components/ImageWithFallback';
import Price from '../components/Price';
import Rating from '../components/Rating';
import StockBadge from '../components/StockBadge';
import usePageTitle from '../hooks/usePageTitle';
import { formatCategory, getStockInfo } from '../utils/format';

export default function Wishlist() {
  usePageTitle('Wishlist');
  const { items, count, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = (item) => {
    if (addToCart(item)) removeFromWishlist(item.id);
  };

  if (count === 0) {
    return (
      <div className="container-x py-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
        <EmptyState icon={Heart} title="Your wishlist is empty" message="Tap the heart on any product to save it here for later.">
          <Link to="/shop" className="btn btn-primary">Discover products</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Wishlist <span className="text-xl font-semibold text-muted">({count})</span></h1>
        <button type="button" onClick={clearWishlist} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-danger">
          <Trash2 size={15} /> Clear wishlist
        </button>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const { available } = getStockInfo(item.stock);
          return (
            <li key={item.id} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
              <button type="button" onClick={() => removeFromWishlist(item.id)} aria-label={`Remove ${item.title} from wishlist`} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full border border-line bg-white/95 text-ink hover:text-danger">
                <X size={16} />
              </button>
              <Link to={`/product/${item.id}`} className="block aspect-square bg-paper">
                <ImageWithFallback src={item.thumbnail} alt={item.title} className={`h-full w-full object-contain p-4 ${available ? '' : 'opacity-50 grayscale'}`} />
              </Link>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-medium text-muted">{formatCategory(item.category)}</p>
                <Link to={`/product/${item.id}`} className="line-clamp-1 font-display font-semibold text-ink hover:text-accent">{item.title}</Link>
                <div className="flex items-center justify-between"><Rating value={item.rating} /><StockBadge stock={item.stock} /></div>
                <div className="mt-auto space-y-3 pt-3">
                  <Price product={item} />
                  <button type="button" disabled={!available} onClick={() => moveToCart(item)} className="btn btn-primary h-10 w-full">
                    <ShoppingBag size={16} /> {available ? 'Move to cart' : 'Out of stock'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
