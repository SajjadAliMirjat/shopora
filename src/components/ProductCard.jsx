import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Rating from './Rating';
import Price from './Price';
import StockBadge from './StockBadge';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCategory, getDiscountLabel, getStockInfo } from '../utils/format';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wished = isWishlisted(product.id);
  const { available } = getStockInfo(product.stock);
  const discount = getDiscountLabel(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow duration-200 hover:shadow-lift">
      <div className="relative">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.title}`} className="block aspect-square overflow-hidden bg-paper">
          <ImageWithFallback
            src={product.thumbnail}
            alt={product.title}
            className={`h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 ${available ? '' : 'opacity-50 grayscale'}`}
          />
        </Link>

        {discount && available && (
          <span className="absolute left-3 top-3 rounded-md bg-ink px-2 py-1 text-xs font-semibold text-white">{discount}</span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            className={`grid h-9 w-9 place-items-center rounded-full border shadow-sm transition-colors ${
              wished ? 'border-danger bg-danger text-white' : 'border-line bg-white/95 text-ink hover:bg-white hover:text-danger'
            }`}
          >
            <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              aria-label={`Quick view ${product.title}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white/95 text-ink shadow-sm transition-colors hover:bg-white hover:text-accent"
            >
              <Eye size={17} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/category/${product.category}`} className="w-fit text-xs font-medium text-muted transition-colors hover:text-accent">
          {formatCategory(product.category)}
        </Link>
        <h3 className="font-display text-base font-semibold leading-snug text-ink">
          <Link to={`/product/${product.id}`} className="line-clamp-1 hover:text-accent" title={product.title}>
            {product.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>

        <div className="mt-1 flex items-center justify-between gap-2">
          <Rating value={product.rating} />
          <StockBadge stock={product.stock} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price product={product} />
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={!available}
            aria-label={available ? `Add ${product.title} to cart` : `${product.title} is out of stock`}
            className="btn btn-primary h-10 shrink-0 px-3.5"
          >
            <ShoppingBag size={16} /> <span className="hidden min-[400px]:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
