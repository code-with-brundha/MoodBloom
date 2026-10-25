/** On / off switch. The "On" / "Off" word is shown too, so state never depends on colour alone. */
export default function ToggleSwitch({ checked, onChange, labelledBy, describedBy, disabled = false }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="w-7 text-right text-sm font-bold text-ink-600">
        {checked ? 'On' : 'Off'}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? 'border-lilac-400 bg-lilac-400' : 'border-lilac-300 bg-lilac-200'
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-on-accent shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </span>
  );
}
