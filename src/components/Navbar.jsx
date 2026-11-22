import { useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import useDialog from '../hooks/useDialog';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
];

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-paper hover:text-ink'}`;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="Shopora home">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-white">
        <ShoppingBag size={17} aria-hidden="true" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">Shopora</span>
    </Link>
  );
}

function SearchForm({ onDone, className = '' }) {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setValue('');
    onDone?.();
  };

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="input h-10 w-full pl-10"
      />
    </form>
  );
}

function MobileMenu({ onClose }) {
  const ref = useRef(null);
  useDialog(ref, onClose);
  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 animate-fade bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Main menu" tabIndex={-1} className="absolute inset-y-0 right-0 flex w-[84%] max-w-sm animate-drawer-right flex-col bg-white p-5 shadow-lift focus:outline-none">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-bold">Menu</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper">
            <X size={20} />
          </button>
        </div>
        <SearchForm onDone={onClose} className="mb-5" />
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={onClose} className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-ink text-white' : 'text-ink hover:bg-paper'}`}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/wishlist" onClick={onClose} className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-ink text-white' : 'text-ink hover:bg-paper'}`}>
            Wishlist
          </NavLink>
          <NavLink to="/cart" onClick={onClose} className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-medium ${isActive ? 'bg-ink text-white' : 'text-ink hover:bg-paper'}`}>
            Cart
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-white" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { count } = useWishlist();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center gap-4">
        <Logo />
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <SearchForm className="ml-auto hidden w-full max-w-xs md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/wishlist" aria-label={`Wishlist, ${count} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-paper">
            <Heart size={20} />
            <CountBadge count={count} />
          </Link>
          <Link to="/cart" aria-label={`Cart, ${totalQuantity} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-paper">
            <ShoppingBag size={20} />
            <CountBadge count={totalQuantity} />
          </Link>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen} className="grid h-10 w-10 place-items-center rounded-full text-ink hover:bg-paper md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
