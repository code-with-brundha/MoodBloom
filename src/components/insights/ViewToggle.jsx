/** Pill-style switch between options (used for Weekly / Monthly). Matches the Mood Tracker's toggle. */
export default function ViewToggle({ value, onChange, options, label = 'View by' }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid rounded-full bg-lilac-100/70 p-1 sm:w-64"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className={`rounded-full px-4 py-2 text-sm font-bold transition ${
            value === option.key ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-600 hover:text-ink-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
