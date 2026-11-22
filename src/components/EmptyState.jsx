export default function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-paper text-muted">
          <Icon size={22} aria-hidden="true" />
        </span>
      )}
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {message && <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>}
      {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  );
}
