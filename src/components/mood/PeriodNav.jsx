/** ‹ label › arrows for moving back and forward through days, weeks or months. */
export default function PeriodNav({ label, onPrev, onNext, nextDisabled }) {
  const arrow =
    'flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-ink-600 transition hover:bg-lilac-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent';

  return (
    <div className="flex items-center justify-between gap-1 sm:justify-start">
      <button type="button" onClick={onPrev} aria-label="Previous" className={arrow}>
        ‹
      </button>
      <span aria-live="polite" className="min-w-[10rem] text-center text-sm font-bold text-ink-700">
        {label}
      </span>
      <button type="button" onClick={onNext} disabled={nextDisabled} aria-label="Next" className={arrow}>
        ›
      </button>
    </div>
  );
}
