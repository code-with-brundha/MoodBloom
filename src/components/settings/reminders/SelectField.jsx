/** Labelled dropdown that matches the form fields used elsewhere (same look as the Planner's reminder select). */
export default function SelectField({ id, label, value, onChange, options, error, hint }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="max-w-xs">
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink-700">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedBy}
        className={`w-full rounded-2xl border-2 bg-white/80 px-4 py-3 text-base text-ink-800 transition focus:bg-white focus:outline-none focus:ring-4 ${
          error ? 'border-blush-400 focus:ring-blush-200' : 'border-lilac-200 focus:border-lilac-400 focus:ring-lilac-200/70'
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-ink-800">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
