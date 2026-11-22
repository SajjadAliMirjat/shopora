import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SectionHeader({ title, description, to, linkLabel = 'View all' }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-muted">{description}</p>}
      </div>
      {to && (
        <Link to={to} className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark sm:inline-flex">
          {linkLabel} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
