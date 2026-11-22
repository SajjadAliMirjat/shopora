import { Link } from 'react-router-dom';
import { Code2, Gauge, HeartHandshake, Layers, Sparkles } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import usePageTitle from '../hooks/usePageTitle';

const VALUES = [
  { icon: Sparkles, title: 'Chosen, not piled up', text: 'A focused range beats an endless aisle. Every product earns its place with real ratings and clear prices.' },
  { icon: HeartHandshake, title: 'Clear from the start', text: 'Discounts are shown next to the original price, stock is honest, and shipping costs appear before you commit.' },
  { icon: Gauge, title: 'Fast on any device', text: 'Quick loading, keyboard-friendly controls and layouts that adapt from phones to wide desktops.' },
];

const STACK = ['React 18', 'Vite', 'Tailwind CSS', 'React Router', 'Context API + useReducer', 'LocalStorage', 'DummyJSON API', 'Lucide icons'];

const FEATURES = [
  'Search, category, price and rating filters that combine',
  'Cart and wishlist saved in LocalStorage',
  'Loading skeletons, error states and a built-in offline catalogue',
  'Quick-view modal, recently viewed products and toast notifications',
  'Accessible dialogs, focus handling and skip link',
];

export default function About() {
  usePageTitle('About');
  return (
    <div className="container-x py-8 sm:py-10">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <header className="max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">A smaller shop with a clearer point of view.</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Shopora is a modern storefront for everyday essentials: beauty, fragrance, furniture and pantry staples. We built it around one idea. Shopping online should feel calm, fast and honest.
        </p>
      </header>

      <ul className="mt-14 grid gap-5 md:grid-cols-3">
        {VALUES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl border border-line bg-white p-6">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent-dark"><Icon size={20} aria-hidden="true" /></span>
            <h2 className="mt-5 font-display text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ul>

      <section className="mt-16 grid gap-10 rounded-3xl bg-ink p-8 text-white sm:p-12 lg:grid-cols-2" aria-labelledby="built-title">
        <div>
          <h2 id="built-title" className="font-display text-3xl font-bold tracking-tight">Designed and built by SajooDev</h2>
          <p className="mt-4 max-w-md leading-relaxed text-white/70">
            Shopora is a portfolio project that shows how a complete front-end store comes together: data fetching, state management, filtering, persistence and a polished interface.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology stack">
            {STACK.map((s) => (
              <li key={s} className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium">{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold"><Layers size={18} aria-hidden="true" /> What is inside</h3>
          <ul className="space-y-3 text-sm text-white/80">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5"><Code2 size={16} className="mt-0.5 shrink-0 text-white/50" aria-hidden="true" />{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-12 text-center">
        <Link to="/shop" className="btn btn-primary h-12 px-8 text-base">Start shopping</Link>
      </div>
    </div>
  );
}
