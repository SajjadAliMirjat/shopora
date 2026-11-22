import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {last || !item.to ? (
                <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-ink' : ''}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.to} className="rounded transition-colors hover:text-ink">
                  {item.label}
                </Link>
              )}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
