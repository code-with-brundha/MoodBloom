import PeriodNav from '../mood/PeriodNav.jsx';
import Button from '../Button.jsx';
import { formatLongDate } from '../../utils/tasks.js';

/** Previous / next day arrows, a date picker, and a "Today" shortcut. */
export default function DateNav({ date, today, onChange, onPrev, onNext }) {
  const isToday = date === today;

  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-white/80 bg-white/70 p-4 shadow-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-2">
        <PeriodNav label={isToday ? `Today · ${formatLongDate(date)}` : formatLongDate(date)} onPrev={onPrev} onNext={onNext} />
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="todo-date-picker" className="sr-only">
          Jump to a date
        </label>
        <input
          id="todo-date-picker"
          type="date"
          value={date}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-full border-2 border-lilac-200 bg-white/80 px-4 py-2 text-sm text-ink-800 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70 sm:flex-none"
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => onChange(today)}
          disabled={isToday}
          className="px-5 py-2 text-sm"
        >
          Today
        </Button>
      </div>
    </div>
  );
}
