import JournalIcon from '../journal/JournalIcon.jsx';
import { formatEntryDate } from '../../utils/dates.js';

/** One row in the mood history, with edit and delete buttons. */
export default function MoodRecord({ record, mood, onEdit, onDelete }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 transition hover:shadow-sm sm:gap-4">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-100 text-2xl"
        aria-hidden="true"
      >
        {mood?.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${mood?.chip}`}>{mood?.label}</span>
          <time dateTime={record.date} className="text-sm font-semibold text-ink-500">
            {formatEntryDate(record.date)}
          </time>
        </div>
        <p className="mt-1.5 break-words leading-relaxed text-ink-600">
          {record.note || <span className="text-ink-500/70">No note</span>}
        </p>
      </div>

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onEdit(record)}
          aria-label={`Edit ${mood?.label} mood from ${formatEntryDate(record.date)}`}
          className="rounded-full p-2 text-ink-600 transition hover:bg-lilac-100"
        >
          <JournalIcon name="edit" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(record)}
          aria-label={`Delete ${mood?.label} mood from ${formatEntryDate(record.date)}`}
          className="rounded-full p-2 text-blush-500 transition hover:bg-blush-100"
        >
          <JournalIcon name="trash" />
        </button>
      </div>
    </li>
  );
}
