import DayCell from './DayCell.jsx';
import { WEEKDAYS, buildMonthCells } from '../../utils/calendar.js';

/** Monday-first month grid. Blank cells pad the first week. */
export default function CalendarGrid({
  viewDate,
  selectedKey,
  todayKey,
  moodsByDate,
  entriesByDate,
  moodByKey,
  onSelect,
}) {
  const cells = buildMonthCells(viewDate);

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
        {cells.map((cell, i) =>
          cell ? (
            <DayCell
              key={cell.key}
              day={cell.day}
              dateKey={cell.key}
              isToday={cell.key === todayKey}
              isSelected={cell.key === selectedKey}
              moods={moodsByDate[cell.key] ?? []}
              entryCount={(entriesByDate[cell.key] ?? []).length}
              moodByKey={moodByKey}
              onSelect={onSelect}
            />
          ) : (
            <span key={`blank-${i}`} aria-hidden="true" />
          ),
        )}
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-500 sm:text-sm">
        <span>😊 Mood logged</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-lilac-400" /> Journal entry
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gradient-to-br from-blush-300 to-lilac-300" /> Today
        </span>
      </p>
    </div>
  );
}
