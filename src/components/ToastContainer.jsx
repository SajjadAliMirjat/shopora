import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ICONS = {
  success: <CircleCheck size={18} className="text-emerald-400" />,
  error: <CircleAlert size={18} className="text-red-400" />,
  info: <Info size={18} className="text-sky-300" />,
};

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-full max-w-sm animate-toast items-start gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lift"
        >
          <span className="mt-0.5 shrink-0" aria-hidden="true">{ICONS[toast.type] || ICONS.info}</span>
          <p className="flex-1 leading-snug">{toast.message}</p>
          <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="shrink-0 rounded p-0.5 text-white/60 hover:text-white">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
