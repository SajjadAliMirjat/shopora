import { useRef } from 'react';
import { X } from 'lucide-react';
import useDialog from '../hooks/useDialog';
import FilterPanel from './FilterPanel';

export default function FilterDrawer({ onClose, resultCount, ...panelProps }) {
  const ref = useRef(null);
  useDialog(ref, onClose);

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 animate-fade bg-ink/60" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        tabIndex={-1}
        className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-drawer flex-col bg-white shadow-lift focus:outline-none"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-display text-lg font-bold">Refine results</span>
          <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <FilterPanel {...panelProps} />
        </div>
        <div className="border-t border-line p-4">
          <button type="button" onClick={onClose} className="btn btn-primary w-full">
            Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </button>
        </div>
      </div>
    </div>
  );
}
