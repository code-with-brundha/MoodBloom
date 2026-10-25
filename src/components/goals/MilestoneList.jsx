import { useState } from 'react';
import GoalIcon from './GoalIcon.jsx';

/** Steps for one goal: add, tick off, rename (inline) and delete. `readOnly` for completed/archived goals. */
export default function MilestoneList({ goalId, milestones, readOnly, onAdd, onToggle, onEdit, onDelete }) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');

  const submitNew = (e) => {
    e.preventDefault();
    if (!draft.trim()) {
      setError('Type a small step first.');
      return;
    }
    onAdd(draft.trim());
    setDraft('');
    setError('');
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditValue(m.title);
    setEditError('');
  };

  const saveEdit = (e) => {
    e.preventDefault();
    if (!editValue.trim()) {
      setEditError('A step can’t be empty.');
      return;
    }
    onEdit(editingId, editValue.trim());
    setEditingId(null);
  };

  const inputClass =
    'w-full rounded-full border-2 border-lilac-200 bg-white/80 px-4 py-2 text-sm text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70';

  return (
    <div>
      {milestones.length > 0 && (
        <ul className="space-y-1.5">
          {milestones.map((m) => (
            <li key={m.id} className="rounded-2xl bg-white/60 px-3 py-2">
              {editingId === m.id ? (
                <form onSubmit={saveEdit} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`edit-step-${m.id}`} className="sr-only">
                      Edit step
                    </label>
                    <input
                      id={`edit-step-${m.id}`}
                      autoFocus
                      maxLength={100}
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                        setEditError('');
                      }}
                      onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), setEditingId(null))}
                      aria-invalid={editError ? 'true' : 'false'}
                      className={inputClass}
                    />
                    {editError && (
                      <p role="alert" className="mt-1 pl-2 text-xs font-semibold text-blush-500">
                        {editError}
                      </p>
                    )}
                  </div>
                  <button type="submit" aria-label="Save step" className="rounded-full p-2 text-lilac-500 hover:bg-lilac-100">
                    <GoalIcon name="check" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    aria-label="Cancel editing"
                    className="rounded-full p-2 text-ink-600 hover:bg-lilac-100"
                  >
                    <GoalIcon name="close" className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={m.completed}
                    disabled={readOnly}
                    aria-label={m.completed ? `Mark step "${m.title}" as not done` : `Mark step "${m.title}" as done`}
                    onClick={() => onToggle(m.id)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition disabled:cursor-default ${
                      m.completed
                        ? 'border-transparent bg-gradient-to-br from-blush-300 to-lilac-300 text-on-accent shadow-petal'
                        : 'border-lilac-300 bg-white/80 text-transparent hover:bg-lilac-100 hover:text-lilac-300'
                    }`}
                  >
                    <GoalIcon name="check" className="h-3.5 w-3.5" />
                  </button>
                  <span
                    className={`min-w-0 flex-1 break-words text-sm font-semibold ${
                      m.completed ? 'text-ink-500 line-through decoration-lilac-300' : 'text-ink-700'
                    }`}
                  >
                    {m.title}
                  </span>
                  {!readOnly && (
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(m)}
                        aria-label={`Edit step "${m.title}"`}
                        className="rounded-full p-1.5 text-ink-600 transition hover:bg-lilac-100"
                      >
                        <GoalIcon name="edit" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(m.id)}
                        aria-label={`Delete step "${m.title}"`}
                        className="rounded-full p-1.5 text-blush-500 transition hover:bg-blush-100"
                      >
                        <GoalIcon name="trash" className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {milestones.length === 0 && readOnly && <p className="text-sm text-ink-500">This goal has no steps.</p>}

      {!readOnly && (
        <form onSubmit={submitNew} noValidate className={milestones.length > 0 ? 'mt-3' : ''}>
          <label htmlFor={`new-step-${goalId}`} className="sr-only">
            Add a step
          </label>
          <div className="flex gap-2">
            <input
              id={`new-step-${goalId}`}
              value={draft}
              maxLength={100}
              onChange={(e) => {
                setDraft(e.target.value);
                setError('');
              }}
              placeholder="Add a small step…"
              aria-invalid={error ? 'true' : 'false'}
              className={inputClass}
            />
            <button
              type="submit"
              aria-label="Add step"
              className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 px-4 py-2 text-sm font-bold text-ink-800 shadow-petal transition hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <GoalIcon name="plus" className="h-4 w-4" /> Add
            </button>
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
