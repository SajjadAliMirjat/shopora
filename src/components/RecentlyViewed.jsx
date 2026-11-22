import { Link } from 'react-router-dom';
import ImageWithFallback from './ImageWithFallback';
import SectionHeader from './SectionHeader';
import { formatPrice, getSalePrice } from '../utils/format';

export default function RecentlyViewed({ items, excludeId }) {
  const list = items.filter((p) => p.id !== excludeId).slice(0, 6);
  if (!list.length) return null;
  return (
    <section aria-labelledby="recent-title" className="container-x mt-20">
      <div id="recent-title">
        <SectionHeader title="Recently viewed" description="Pick up where you left off." />
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {list.map((p) => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`} className="group block rounded-xl border border-line bg-white p-3 transition-shadow hover:shadow-card">
              <div className="aspect-square overflow-hidden rounded-lg bg-paper">
                <ImageWithFallback src={p.thumbnail} alt="" className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" />
              </div>
              <p className="mt-3 line-clamp-1 text-sm font-medium text-ink">{p.title}</p>
              <p className="text-sm text-muted">{formatPrice(getSalePrice(p))}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
