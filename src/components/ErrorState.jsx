import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', message, onRetry, children }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-line bg-white px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-red-50 text-danger">
        <TriangleAlert size={22} aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {message && <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-primary">
            <RefreshCw size={16} /> Try again
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
