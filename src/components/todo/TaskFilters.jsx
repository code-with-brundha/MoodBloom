const options = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

/** All / Pending / Completed chips, with a count on each. Controlled by the page. */
export default function TaskFilters({ value, onChange, counts }) {
  const chip = 'rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition';
  const idle = 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100';

  return (
    <div role="group" aria-label="Filter tasks" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={`${chip} ${value === o.key ? 'border-lilac-300 bg-lilac-100 text-ink-800' : idle}`}
        >
          {o.label} <span className="text-ink-500">({counts[o.key]})</span>
        </button>
      ))}
    </div>
  );
}
