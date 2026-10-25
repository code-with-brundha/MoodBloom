import { useState } from 'react';
import GoalIcon from './GoalIcon.jsx';
import { toDateInputValue, formatEntryDate } from '../../utils/dates.js';

/**
 * Small daily tasks connected to a goal. These are separate from milestones:
 * ticking one off NEVER completes the goal or changes its progress.
 */
export default function LinkedTasks({ goalId, tasks, readOnly, onAdd, onToggle, onDelete }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(toDateInputValue());
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('What small task would you like to link?');
    if (!date) return setError('Please choose a date.');
    onAdd({ title: title.trim(), date });
    setTitle('');
    setError('');
    return undefined;
  };

  const sorted = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || a.date.localeCompare(b.date));
  const inputClass =
    'w-full rounded-full border-2 border-lilac-200 bg-white/80 px-4 py-2 text-sm text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70';

  return (
    <div>
      <p className="mb-2 text-xs leading-relaxed text-ink-500">
        Tasks here support this goal but don’t change its progress. Only steps do.
      </p>

      {sorted.length > 0 && (
        <ul className="space-y-1.5">
          {sorted.map((t) => (
            <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={t.completed}
                disabled={readOnly}
                aria-label={t.completed ? `Mark task "${t.title}" as pending` : `Mark task "${t.title}" as done`}
                onClick={() => onToggle(t.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition disabled:cursor-default ${
                  t.completed
                    ? 'border-transparent bg-lilac-300 text-on-accent'
                    : 'border-lilac-300 bg-white/80 text-transparent hover:bg-lilac-100 hover:text-lilac-300'
                }`}
              >
                <GoalIcon name="check" className="h-3.5 w-3.5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className={`break-words text-sm font-semibold ${t.completed ? 'text-ink-500 line-through decoration-lilac-300' : 'text-ink-700'}`}>
                  {t.title}
                </p>
                <p className="text-xs text-ink-500">{t.date ? formatEntryDate(t.date) : ''}</p>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  aria-label={`Remove task "${t.title}"`}
                  className="rounded-full p-1.5 text-blush-500 transition hover:bg-blush-100"
                >
                  <GoalIcon name="trash" className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {sorted.length === 0 && readOnly && <p className="text-sm text-ink-500">No linked tasks.</p>}

      {!readOnly && (
        <form onSubmit={submit} noValidate className={sorted.length > 0 ? 'mt-3' : ''}>
          <div className="space-y-2">
            <label htmlFor={`task-title-${goalId}`} className="sr-only">
              Linked task
            </label>
            <input
              id={`task-title-${goalId}`}
              value={title}
              maxLength={80}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g. Read 10 pages today"
              aria-invalid={error ? 'true' : 'false'}
              className={inputClass}
            />
            <div className="flex gap-2">
              <label htmlFor={`task-date-${goalId}`} className="sr-only">
                Task date
              </label>
              <input
                id={`task-date-${goalId}`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-1 rounded-full border-2 border-lilac-300 bg-white/70 px-4 py-2 text-sm font-bold text-ink-700 transition hover:-translate-y-0.5 hover:bg-lilac-100"
              >
                <GoalIcon name="link" className="h-4 w-4" /> Link
              </button>
            </div>
          </div>
          {error && (
            <p role="alert" className="mt-1.5 pl-3 text-xs font-semibold text-blush-500">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
