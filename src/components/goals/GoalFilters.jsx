import { categories } from '../../utils/goals.js';

const tabs = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'archived', label: 'Archived' },
];
const deadlineOptions = [
  { key: 'all', label: 'Any deadline' },
  { key: 'soon', label: 'Due soon' },
  { key: 'overdue', label: 'Overdue' },
];

/** Status tabs + category chips (+ deadline chips on the Active tab). Controlled by the page. */
export default function GoalFilters({ tab, onTabChange, counts, category, onCategoryChange, deadline, onDeadlineChange }) {
  const chip = 'rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition';
  const idle = 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100';
  const on = 'border-lilac-300 bg-lilac-100 text-ink-800';

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Goal status" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/60 p-1.5 shadow-soft">
        {tabs.map((t) => {
          const selected = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`goal-tab-${t.key}`}
              aria-selected={selected}
              aria-controls="goal-list"
              onClick={() => onTabChange(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                selected ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm' : 'text-ink-600 hover:bg-lilac-100'
              }`}
            >
              {t.label} <span className="text-ink-500">({counts[t.key]})</span>
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={category === 'all'} onClick={() => onCategoryChange('all')} className={`${chip} ${category === 'all' ? on : idle}`}>
          All categories
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={category === c.key}
            onClick={() => onCategoryChange(c.key)}
            className={`${chip} ${category === c.key ? on : idle}`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {tab === 'active' && (
        <div role="group" aria-label="Filter by deadline" className="flex flex-wrap gap-2">
          {deadlineOptions.map((o) => (
            <button key={o.key} type="button" aria-pressed={deadline === o.key} onClick={() => onDeadlineChange(o.key)} className={`${chip} ${deadline === o.key ? on : idle}`}>
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
