import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import ImageWithFallback from '../components/ImageWithFallback';
import QuantityStepper from '../components/QuantityStepper';
import usePageTitle from '../hooks/usePageTitle';
import { formatCategory, formatPrice, getSalePrice, roundMoney } from '../utils/format';

export default function Cart() {
  usePageTitle('Cart');
  const { items, totalQuantity, subtotal, shipping, total, removeFromCart, increase, decrease, clearCart } = useCart();
  const { notify } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
        <EmptyState icon={ShoppingBag} title="Your cart is empty" message="Add a few things you like and they will be waiting here, even if you close the tab.">
          <Link to="/shop" className="btn btn-primary">Start shopping</Link>
        </EmptyState>
      </div>
    );
  }

  const toFree = roundMoney(Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal));
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Your cart <span className="text-xl font-semibold text-muted">({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span></h1>
        {confirmClear ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted">Remove everything?</span>
            <button type="button" onClick={() => { clearCart(); setConfirmClear(false); }} className="btn h-9 bg-danger px-3 text-white hover:bg-danger/90">Yes, clear cart</button>
            <button type="button" onClick={() => setConfirmClear(false)} className="btn btn-outline h-9 px-3">Keep items</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmClear(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-danger">
            <Trash2 size={15} /> Clear cart
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-4">
          {items.map((item) => {
            const unit = getSalePrice(item);
            return (
              <li key={item.id} className="flex gap-4 rounded-2xl border border-line bg-white p-4 sm:gap-5 sm:p-5">
                <Link to={`/product/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-paper sm:h-28 sm:w-28">
                  <ImageWithFallback src={item.thumbnail} alt={item.title} className="h-full w-full object-contain p-2" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${item.id}`} className="line-clamp-2 font-display font-semibold text-ink hover:text-accent">{item.title}</Link>
                      <p className="mt-0.5 text-sm text-muted">{formatCategory(item.category)}</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.title} from cart`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-danger">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                    <QuantityStepper size="sm" value={item.quantity} max={item.stock} label={`Quantity for ${item.title}`} onDecrease={() => decrease(item.id)} onIncrease={() => increase(item.id)} />
                    <div className="text-right">
                      <p className="font-display text-lg font-bold">{formatPrice(unit * item.quantity)}</p>
                      {item.quantity > 1 && <p className="text-xs text-muted">{formatPrice(unit)} each</p>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside aria-label="Order summary" className="h-fit rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Order summary</h2>

          <div className="mt-5 rounded-xl bg-paper p-3.5">
            <p className="flex items-center gap-2 text-sm text-ink">
              <Truck size={16} className="text-accent" aria-hidden="true" />
              {toFree > 0 ? <>Add <strong>{formatPrice(toFree)}</strong> more for free shipping</> : <strong>You have free shipping</strong>}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress to free shipping">
              <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-medium">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd className="font-medium">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-line pt-4 text-base"><dt className="font-semibold">Total</dt><dd className="font-display text-xl font-bold">{formatPrice(total)}</dd></div>
          </dl>

          <button type="button" onClick={() => notify('Checkout is turned off in this demo store. No order was placed.', 'info')} className="btn btn-primary mt-6 h-12 w-full text-base">
            Checkout
          </button>
          <Link to="/shop" className="mt-3 block text-center text-sm font-semibold text-accent hover:text-accent-dark">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
