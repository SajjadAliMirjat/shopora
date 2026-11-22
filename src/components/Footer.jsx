import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const col = 'space-y-2.5 text-sm text-white/70';
const link = 'transition-colors hover:text-white';

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink">
              <ShoppingBag size={17} aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight">Shopora</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Everyday objects, chosen well. Beauty, home, fragrance and pantry staples with clear prices and free shipping over $100.
          </p>
        </div>

        <nav aria-label="Shop links">
          <h2 className="mb-4 font-display text-sm font-semibold">Shop</h2>
          <ul className={col}>
            <li><Link className={link} to="/shop">All products</Link></li>
            <li><Link className={link} to="/category/beauty">Beauty</Link></li>
            <li><Link className={link} to="/category/fragrances">Fragrances</Link></li>
            <li><Link className={link} to="/category/furniture">Furniture</Link></li>
            <li><Link className={link} to="/category/groceries">Groceries</Link></li>
          </ul>
        </nav>

        <nav aria-label="Account links">
          <h2 className="mb-4 font-display text-sm font-semibold">Your account</h2>
          <ul className={col}>
            <li><Link className={link} to="/cart">Cart</Link></li>
            <li><Link className={link} to="/wishlist">Wishlist</Link></li>
          </ul>
        </nav>

        <nav aria-label="Company links">
          <h2 className="mb-4 font-display text-sm font-semibold">Company</h2>
          <ul className={col}>
            <li><Link className={link} to="/about">About Shopora</Link></li>
            <li><a className={link} href="https://dummyjson.com" target="_blank" rel="noreferrer">Product data: DummyJSON</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shopora. A demo storefront, no real orders are placed.</p>
          <p>Designed and built by SajooDev</p>
        </div>
      </div>
    </footer>
  );
}
