/** A labelled checkbox row with a short description underneath. Used by the import and clear lists. */
export default function CheckRow({ id, checked, onChange, disabled = false, label, description, testId }) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 rounded-2xl border border-lilac-200/70 bg-white/60 px-4 py-3 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-lilac-100/60'
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        data-testid={testId}
        className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-lilac-500 disabled:cursor-not-allowed"
      />
      <span className="min-w-0">
        <span className={`block font-bold ${disabled ? 'text-ink-600' : 'text-ink-800'}`}>{label}</span>
        {description && <span className="mt-0.5 block text-sm leading-relaxed text-ink-600">{description}</span>}
      </span>
    </label>
  );
}
