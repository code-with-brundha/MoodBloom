/** Month title with previous / next buttons and a "Today" shortcut. */
export default function CalendarHeader({ label, onPrev, onNext, onToday }) {
  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold text-ink-600 transition hover:bg-lilac-100';

  return (
    <div className="flex items-center justify-between gap-2">
      <h2 aria-live="polite" className="text-xl font-semibold sm:text-2xl">
        {label}
      </h2>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToday}
          className="mr-1 rounded-full border-2 border-lilac-300 bg-white/70 px-3.5 py-1.5 text-sm font-bold text-ink-700 transition hover:bg-lilac-100"
        >
          Today
        </button>
        <button type="button" onClick={onPrev} aria-label="Previous month" className={arrow}>
          ‹
        </button>
        <button type="button" onClick={onNext} aria-label="Next month" className={arrow}>
          ›
        </button>
      </div>
    </div>
  );
}
