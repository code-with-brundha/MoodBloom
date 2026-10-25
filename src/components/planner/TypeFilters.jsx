import { eventTypes } from '../../utils/planner.js';

/** Event-type chips. They double as the colour legend and filter the calendar + agenda. */
export default function TypeFilters({ value, onChange }) {
  const chip = 'inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-bold transition';
  const idle = 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100';
  const on = 'border-lilac-300 bg-lilac-100 text-ink-800';

  return (
    <div role="group" aria-label="Filter by event type" className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={value === 'all'} onClick={() => onChange('all')} className={`${chip} ${value === 'all' ? on : idle}`}>
        All types
      </button>
      {eventTypes.map((t) => (
        <button
          key={t.key}
          type="button"
          aria-pressed={value === t.key}
          onClick={() => onChange(t.key)}
          className={`${chip} ${value === t.key ? on : idle}`}
        >
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}
