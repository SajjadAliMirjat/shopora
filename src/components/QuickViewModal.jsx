import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, ShoppingBag, X } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import Rating from './Rating';
import Price from './Price';
import StockBadge from './StockBadge';
import QuantityStepper from './QuantityStepper';
import useDialog from '../hooks/useDialog';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCategory, getStockInfo } from '../utils/format';

export default function QuickViewModal({ product, onClose }) {
  const dialogRef = useRef(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { available } = getStockInfo(product.stock);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const wished = isWishlisted(product.id);

  useDialog(dialogRef, onClose);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        tabIndex={-1}
        className="relative grid max-h-[92vh] w-full max-w-3xl animate-pop overflow-y-auto rounded-t-3xl bg-white shadow-lift focus:outline-none sm:grid-cols-2 sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-sm ring-1 ring-line hover:bg-paper"
        >
          <X size={18} />
        </button>

        <div className="bg-paper p-6">
          <div className="aspect-square">
            <ImageWithFallback src={images[activeImage]} alt={product.title} className="h-full w-full object-contain" loading="eager" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.slice(0, 5).map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === activeImage}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white ${i === activeImage ? 'border-accent' : 'border-line'}`}
                >
                  <ImageWithFallback src={src} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div>
            <p className="text-sm font-medium text-muted">{formatCategory(product.category)}</p>
            <h2 id="quick-view-title" className="mt-1 pr-8 font-display text-2xl font-bold leading-tight tracking-tight text-ink">
              {product.title}
            </h2>
          </div>
          <Rating value={product.rating} count={product.reviews?.length || undefined} />
          <Price product={product} size="lg" />
          <p className="text-sm leading-relaxed text-muted">{product.description}</p>
          <StockBadge stock={product.stock} />

          <div className="flex flex-wrap items-center gap-3">
            {available && (
              <QuantityStepper
                value={quantity}
                max={product.stock}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              />
            )}
            <button type="button" disabled={!available} onClick={() => addToCart(product, quantity)} className="btn btn-primary h-10 flex-1">
              <ShoppingBag size={16} /> {available ? 'Add to cart' : 'Out of stock'}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={wished}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`grid h-10 w-10 place-items-center rounded-lg border transition-colors ${
                wished ? 'border-danger bg-danger text-white' : 'border-line text-ink hover:text-danger'
              }`}
            >
              <Heart size={17} fill={wished ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link to={`/product/${product.id}`} onClick={onClose} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark">
            View full details <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
