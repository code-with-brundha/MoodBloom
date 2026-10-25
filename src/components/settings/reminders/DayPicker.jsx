import { DAY_PRESETS, WEEK_DAYS } from '../../../utils/reminders.js';

/** Pick the days of the week, with quick "Every day / Weekdays / Weekends" shortcuts. */
export default function DayPicker({ id, value, onChange, error }) {
  const toggle = (day) =>
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort((a, b) => a - b));
  const sameAs = (days) => days.length === value.length && days.every((d) => value.includes(d));

  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} className="min-w-0">
      <legend className="mb-1.5 block text-sm font-bold text-ink-700">Days</legend>

      <div className="grid max-w-md grid-cols-7 gap-1.5 sm:gap-2">
        {WEEK_DAYS.map((day, index) => {
          const selected = value.includes(day.value);
          return (
            <button
              key={day.value}
              id={index === 0 ? `${id}-first` : undefined}
              type="button"
              aria-pressed={selected}
              aria-label={day.long}
              onClick={() => toggle(day.value)}
              className={`h-11 rounded-full border-2 text-xs font-bold transition sm:text-sm ${
                selected
                  ? 'border-lilac-400 bg-lilac-200 text-ink-800 shadow-sm'
                  : 'border-lilac-200 bg-white/70 text-ink-700 hover:bg-lilac-100'
              }`}
            >
              {day.short}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick day choices">
        {DAY_PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            aria-pressed={sameAs(preset.days)}
            onClick={() => onChange([...preset.days])}
            className={`rounded-full px-3.5 py-1.5 text-sm font-bold text-ink-700 transition hover:bg-lilac-100 ${
              sameAs(preset.days) ? 'bg-lilac-100 underline underline-offset-4' : 'bg-white/60'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-ink-800">
          {error}
        </p>
      )}
    </fieldset>
  );
}
