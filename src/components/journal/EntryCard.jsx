import { useState } from 'react';
import JournalIcon from './JournalIcon.jsx';
import { formatEntryDate } from '../../utils/dates.js';

const LONG_TEXT = 160;

/** One journal entry as a soft card, with edit and delete buttons. */
export default function EntryCard({ entry, mood, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.text.length > LONG_TEXT;

  return (
    <article className="flex flex-col rounded-3xl border border-white/80 bg-white/70 p-5 shadow-soft backdrop-blur-md transition hover:-translate-y-0.5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <time dateTime={entry.date} className="text-sm font-semibold text-ink-500">
          {formatEntryDate(entry.date)}
        </time>
        {mood && (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${mood.chip}`}>
            {mood.emoji} {mood.label}
          </span>
        )}
      </div>

      <h3 className="mt-3 break-words text-xl font-semibold">{entry.title}</h3>

      <p
        className={`mt-2 whitespace-pre-line break-words leading-relaxed text-ink-600 ${
          expanded ? '' : 'line-clamp-3'
        }`}
      >
        {entry.text}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-2 self-start rounded-full text-sm font-bold text-lilac-500 hover:underline"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="mt-auto flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          aria-label={`Edit "${entry.title}"`}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-ink-600 transition hover:bg-lilac-100"
        >
          <JournalIcon name="edit" className="h-4 w-4" /> Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry)}
          aria-label={`Delete "${entry.title}"`}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-blush-500 transition hover:bg-blush-100"
        >
          <JournalIcon name="trash" className="h-4 w-4" /> Delete
        </button>
      </div>
    </article>
  );
}
