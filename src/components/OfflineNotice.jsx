import { CloudOff, RefreshCw } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';

/** Shown when the live API failed and the bundled catalogue is being used. */
export default function OfflineNotice() {
  const { usingFallback, error, retry, loading } = useProducts();
  if (!usingFallback) return null;
  return (
    <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <CloudOff size={18} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-sm text-amber-900">
          <span className="font-semibold">The live catalogue is unavailable.</span> {error} Showing a saved selection of products instead.
        </p>
      </div>
      <button type="button" onClick={retry} disabled={loading} className="btn btn-outline shrink-0 bg-white">
        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Retry
      </button>
    </div>
  );
}
