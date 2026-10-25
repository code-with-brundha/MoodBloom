import { categories, sortOptions, statuses } from '../../utils/bucket.js';

/** Status chips (with counts), category chips, and a sort menu. Controlled by the page. */
export default function BucketFilters({ status, onStatusChange, counts, category, onCategoryChange, sort, onSortChange }) {
  const chip = 'rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition';
  const idle = 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100';
  const on = 'border-lilac-300 bg-lilac-100 text-ink-800';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={status === 'all'} onClick={() => onStatusChange('all')} className={`${chip} ${status === 'all' ? on : idle}`}>
            All <span className="text-ink-500">({counts.all})</span>
          </button>
          {statuses.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={status === s.key}
              onClick={() => onStatusChange(s.key)}
              className={`${chip} ${status === s.key ? on : idle}`}
            >
              {s.emoji} {s.label} <span className="text-ink-500">({counts[s.key]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="bucket-sort" className="text-sm font-bold text-ink-600">
            Sort by
          </label>
          <select
            id="bucket-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-full border-2 border-lilac-200 bg-white/80 px-4 py-2 text-sm font-bold text-ink-700 transition focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
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
    </div>
  );
}
