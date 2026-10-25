/** Soft frosted card used for every dashboard section. */
export default function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section
      className={`rounded-3xl border border-white/80 bg-white/70 p-5 shadow-soft backdrop-blur-md sm:p-6 ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-xl font-semibold">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
