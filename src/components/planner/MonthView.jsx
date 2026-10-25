import { WEEKDAYS } from '../../utils/calendar.js';
import { eventTypeByKey, fullDateLabel, monthGridKeys, plural } from '../../utils/planner.js';

/** Proper Monday-first month grid (full weeks). Days from neighbouring months are dimmed. */
export default function MonthView({ selectedKey, todayKey, eventsByDate, onSelect }) {
  const keys = monthGridKeys(selectedKey);
  const viewMonth = selectedKey.slice(0, 7);

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2" aria-hidden="true">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-center text-xs font-bold text-ink-500 sm:text-sm">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {keys.map((key) => {
          const events = eventsByDate[key] ?? [];
          const isToday = key === todayKey;
          const isSelected = key === selectedKey;
          const inMonth = key.startsWith(viewMonth);
          const types = [...new Set(events.map((e) => e.type))].slice(0, 3);

          const state = isSelected
            ? 'border-lilac-400 bg-lilac-100 shadow-sm'
            : isToday
              ? 'border-blush-300 bg-white/80 hover:bg-lilac-100/70'
              : 'border-transparent bg-white/60 hover:bg-lilac-100/70';

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={isSelected}
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${fullDateLabel(key)}${isToday ? ', today' : ''}: ${events.length ? plural(events.length, 'plan') : 'no plans'}`}
              className={`flex h-14 flex-col items-center justify-between rounded-xl border-2 px-0.5 py-1 transition sm:h-24 sm:rounded-2xl sm:px-2 sm:py-2 ${state} ${
                inMonth ? '' : 'opacity-45'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${
                  isToday ? 'bg-gradient-to-br from-blush-300 to-lilac-300 text-ink-800 shadow-petal' : 'text-ink-700'
                }`}
              >
                {Number(key.slice(8))}
              </span>

              <span className="flex h-3 items-center gap-1" aria-hidden="true">
                {types.map((t) => (
                  <span key={t} className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${eventTypeByKey[t].dot}`} />
                ))}
              </span>

              <span className="hidden h-4 text-[11px] font-bold text-ink-500 sm:block" aria-hidden="true">
                {events.length > 0 ? plural(events.length, 'plan') : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
