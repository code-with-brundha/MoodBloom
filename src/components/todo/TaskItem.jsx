import TodoIcon from './TodoIcon.jsx';
import { formatTime, priorityByKey } from '../../utils/tasks.js';

/** One task row: round check button, details, and edit / delete actions. */
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const priority = priorityByKey[task.priority];

  return (
    <li
      className={`flex items-start gap-3 rounded-3xl border border-white/80 p-4 shadow-soft backdrop-blur-md transition sm:p-5 ${
        task.completed ? 'bg-white/45' : 'bg-white/70 hover:-translate-y-0.5'
      }`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? 'border-transparent bg-gradient-to-br from-blush-300 to-lilac-300 text-on-accent shadow-petal'
            : 'border-lilac-300 bg-white/80 text-transparent hover:bg-lilac-100 hover:text-lilac-300'
        }`}
      >
        <TodoIcon name="check" className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <h3
          className={`break-words text-lg font-semibold ${
            task.completed ? 'text-ink-500 line-through decoration-lilac-300' : ''
          }`}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            className={`mt-1 whitespace-pre-line break-words text-sm leading-relaxed ${
              task.completed ? 'text-ink-500/80' : 'text-ink-600'
            }`}
          >
            {task.description}
          </p>
        )}

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {task.time && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-ink-600">
              <TodoIcon name="clock" className="h-3.5 w-3.5" /> {formatTime(task.time)}
            </span>
          )}
          {priority && (
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${priority.chip}`}>
              {priority.emoji} {priority.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <button
          type="button"
          onClick={() => onEdit(task)}
          aria-label={`Edit "${task.title}"`}
          className="rounded-full p-2 text-ink-600 transition hover:bg-lilac-100"
        >
          <TodoIcon name="edit" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          aria-label={`Delete "${task.title}"`}
          className="rounded-full p-2 text-blush-500 transition hover:bg-blush-100"
        >
          <TodoIcon name="trash" className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
