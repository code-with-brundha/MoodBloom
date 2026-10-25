import { WEEKDAYS } from '../../utils/calendar.js';
import { formatTime } from '../../utils/tasks.js';
import { eventTypeByKey, fullDateLabel, plural, weekKeys } from '../../utils/planner.js';
import PlannerIcon from './PlannerIcon.jsx';

/**
 * All seven days of the week with their events.
 * One column per day on wide screens, stacked day cards on tablets and phones.
 */
export default function WeekView({ selectedKey, todayKey, eventsByDate, onSelect, onAdd }) {
  const keys = weekKeys(selectedKey);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
      {keys.map((key, i) => {
        const events = eventsByDate[key] ?? [];
        const isToday = key === todayKey;
        const isSelected = key === selectedKey;
        const state = isSelected
          ? 'border-lilac-400 bg-lilac-100/70 shadow-sm'
          : isToday
            ? 'border-blush-300 bg-white/80'
            : 'border-transparent bg-white/60';

        return (
          <section
            key={key}
            aria-label={`${fullDateLabel(key)}: ${events.length ? plural(events.length, 'plan') : 'no plans'}`}
            className={`flex min-w-0 flex-col rounded-3xl border-2 p-3 transition sm:last:col-span-2 xl:last:col-span-1 ${state}`}
          >
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => onSelect(key)}
                aria-pressed={isSelected}
                aria-current={isToday ? 'date' : undefined}
                aria-label={`View ${fullDateLabel(key)}${isToday ? ' (today)' : ''}`}
                className="flex items-center gap-2 rounded-full py-0.5 pr-2 transition hover:bg-lilac-100"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    isToday ? 'bg-gradient-to-br from-blush-300 to-lilac-300 text-ink-800 shadow-petal' : 'bg-white/80 text-ink-700'
                  }`}
                >
                  {Number(key.slice(8))}
                </span>
                <span className="text-sm font-bold text-ink-600">{WEEKDAYS[i]}</span>
              </button>
              <button
                type="button"
                onClick={() => onAdd(key)}
                aria-label={`Add a plan on ${fullDateLabel(key)}`}
                className="rounded-full p-1.5 text-lilac-500 transition hover:bg-lilac-100"
              >
                <PlannerIcon name="plus" className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 flex-1 space-y-1.5">
              {events.map((e) => {
                const type = eventTypeByKey[e.type];
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(key)}
                      aria-label={`${e.title}, ${formatTime(e.startTime)}. Open this day`}
                      className={`w-full rounded-xl border-l-4 px-2.5 py-1.5 text-left text-xs transition hover:-translate-y-0.5 hover:shadow-sm ${type.chip} ${type.border}`}
                    >
                      <span className="block font-bold text-ink-600">{formatTime(e.startTime)}</span>
                      <span className="block break-words font-bold">{e.title}</span>
                    </button>
                  </li>
                );
              })}
              {events.length === 0 && (
                <li className="rounded-xl border border-dashed border-lilac-200 px-2 py-3 text-center text-xs text-ink-500">
                  No plans
                </li>
              )}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
