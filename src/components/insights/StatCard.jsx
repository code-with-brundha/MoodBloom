/** Small number card: icon/emoji, label, big value and a short hint underneath. */
export default function StatCard({ emoji, label, value, hint }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/70 p-4 shadow-soft backdrop-blur-md sm:p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-ink-500">
        <span aria-hidden="true" className="text-lg">
          {emoji}
        </span>
        {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-ink-800 sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs font-semibold text-ink-500 sm:text-sm">{hint}</p>}
    </div>
  );
}
