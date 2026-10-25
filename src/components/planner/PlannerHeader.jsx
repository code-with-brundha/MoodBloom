import PlannerIcon from './PlannerIcon.jsx';

const views = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
];

/** Weekly / Monthly switch, period title, and Previous / Today / Next buttons. */
export default function PlannerHeader({ view, onViewChange, title, summary, onPrev, onNext, onToday }) {
  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-lilac-100';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Planner view" className="inline-flex gap-1 rounded-full bg-white/70 p-1.5 shadow-soft">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={view === v.key}
              onClick={() => onViewChange(v.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                view === v.key
                  ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm'
                  : 'text-ink-600 hover:bg-lilac-100'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToday}
            className="mr-1 rounded-full border-2 border-lilac-300 bg-white/70 px-3.5 py-1.5 text-sm font-bold text-ink-700 transition hover:bg-lilac-100"
          >
            Today
          </button>
          <button type="button" onClick={onPrev} aria-label={view === 'week' ? 'Previous week' : 'Previous month'} className={arrow}>
            <PlannerIcon name="left" />
          </button>
          <button type="button" onClick={onNext} aria-label={view === 'week' ? 'Next week' : 'Next month'} className={arrow}>
            <PlannerIcon name="right" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h2 aria-live="polite" className="text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <p className="mt-0.5 text-sm font-semibold text-ink-500">{summary}</p>
      </div>
    </div>
  );
}
