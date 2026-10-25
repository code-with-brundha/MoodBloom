import BucketIcon from './BucketIcon.jsx';
import { categoryByKey, getTargetInfo, statusByKey, statuses } from '../../utils/bucket.js';
import { formatEntryDate } from '../../utils/dates.js';

const targetChip = {
  passed: 'bg-cream-200 text-ink-700',
  soon: 'bg-lilac-200 text-ink-800',
  later: '',
};

/** One dream: details, subtle status styling, quick status switch, and reflection. */
export default function BucketCard({ item, today, celebrating, onStatusChange, onEdit, onDelete, onReflect }) {
  const category = categoryByKey[item.category];
  const status = statusByKey[item.status];
  const target = getTargetInfo(item, today);
  const done = item.status === 'completed';

  return (
    <li
      className={`relative overflow-hidden rounded-3xl border p-5 pt-6 shadow-soft backdrop-blur-md transition sm:p-6 sm:pt-7 ${status.card} ${
        celebrating ? 'mb-pop' : ''
      }`}
    >
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${status.accent}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${category.chip}`}>
                {category.emoji} {category.label}
              </span>
            )}
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.chip}`}>
              {status.emoji} {status.label}
            </span>
          </div>
          <h3 className="mt-2.5 break-words text-xl font-semibold">{item.title}</h3>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onEdit(item)}
            aria-label={`Edit "${item.title}"`}
            className="rounded-full p-2 text-ink-600 transition hover:bg-lilac-100"
          >
            <BucketIcon name="edit" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            aria-label={`Delete "${item.title}"`}
            className="rounded-full p-2 text-blush-500 transition hover:bg-blush-100"
          >
            <BucketIcon name="trash" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {item.description && (
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">{item.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-ink-500">
        <span className="inline-flex items-center gap-1">
          <BucketIcon name="calendar" className="h-3.5 w-3.5" />
          {done && item.completedDate
            ? `Completed ${formatEntryDate(item.completedDate)}`
            : item.targetDate
              ? `Target: ${formatEntryDate(item.targetDate)}`
              : 'Someday ✨'}
        </span>
        {target?.label && (
          <span className={`rounded-full px-2.5 py-1 font-bold ${targetChip[target.state]}`}>{target.label}</span>
        )}
      </div>

      {item.notes && (
        <div className="mt-3 rounded-2xl bg-white/70 px-4 py-3">
          <p className="text-xs font-bold text-ink-500">📝 Notes</p>
          <p className="mt-0.5 whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">{item.notes}</p>
        </div>
      )}

      {done && (
        <div className="mt-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
          <p className="text-xs font-bold text-lilac-500">💭 My memory</p>
          {item.reflection ? (
            <p className="mt-0.5 whitespace-pre-line break-words font-display text-base italic leading-relaxed text-ink-700">
              {item.reflection}
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-ink-500">You haven’t written a reflection yet.</p>
          )}
          <button
            type="button"
            onClick={() => onReflect(item)}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-lilac-500 underline decoration-lilac-300 underline-offset-2 hover:text-lilac-400"
          >
            <BucketIcon name="feather" className="h-4 w-4" />
            {item.reflection ? 'Edit reflection' : 'Add a reflection'}
          </button>
        </div>
      )}

      <div role="group" aria-label={`Status for "${item.title}"`} className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-white/60 p-1">
        {statuses.map((s) => {
          const selected = item.status === s.key;
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={selected}
              onClick={() => onStatusChange(item, s.key)}
              className={`rounded-full px-2 py-1.5 text-xs font-bold transition sm:text-sm ${
                selected ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm' : 'text-ink-600 hover:bg-lilac-100'
              }`}
            >
              <span aria-hidden="true">{s.emoji}</span> {s.label}
            </button>
          );
        })}
      </div>
    </li>
  );
}
