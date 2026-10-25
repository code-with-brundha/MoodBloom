/**
 * Pick one of a few options (segmented control built on real radio buttons,
 * so the arrow keys, screen readers and forms all work as expected).
 */
export default function ChoiceGroup({ name, label, options, value, onChange, disabled = false, describedBy }) {
  return (
    <fieldset disabled={disabled} aria-describedby={describedBy} className="min-w-0">
      <legend className="sr-only">{label}</legend>
      <div
        className={`grid gap-1 rounded-full bg-lilac-100/80 p-1 ${options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} ${
          disabled ? 'opacity-60' : ''
        }`}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition focus-within:ring-2 focus-within:ring-lilac-400 ${
                selected ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-600 hover:bg-white/60 hover:text-ink-800'
              } ${disabled ? 'cursor-not-allowed' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
