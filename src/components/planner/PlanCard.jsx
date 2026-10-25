import PlannerIcon from './PlannerIcon.jsx';
import { formatTime } from '../../utils/tasks.js';
import { eventTypeByKey, reminderLabel } from '../../utils/planner.js';

/** One plan in the day agenda: time, type, details and edit / delete. */
export default function PlanCard({ plan, onEdit, onDelete }) {
  const type = eventTypeByKey[plan.type];
  const reminder = reminderLabel(plan.reminder);

  return (
    <li className={`flex items-start gap-3 rounded-3xl border border-l-4 border-white/80 bg-white/70 p-4 shadow-soft transition ${type.border}`}>
      <div className="w-20 shrink-0 text-sm font-bold text-ink-700 sm:w-24">
        <p>{formatTime(plan.startTime)}</p>
        {plan.endTime && <p className="font-semibold text-ink-500">to {formatTime(plan.endTime)}</p>}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="break-words text-lg font-semibold">{plan.title}</h3>
        {plan.description && (
          <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">{plan.description}</p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${type.chip}`}>
            {type.emoji} {type.label}
          </span>
          {reminder && (
            <span
              title="Saved as a preference only. MoodBloom doesn't send notifications."
              className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-ink-600"
            >
              <PlannerIcon name="bell" className="h-3.5 w-3.5 shrink-0" /> {reminder}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <button
          type="button"
          onClick={() => onEdit(plan)}
          aria-label={`Edit "${plan.title}"`}
          className="rounded-full p-2 text-ink-600 transition hover:bg-lilac-100"
        >
          <PlannerIcon name="edit" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(plan)}
          aria-label={`Delete "${plan.title}"`}
          className="rounded-full p-2 text-blush-500 transition hover:bg-blush-100"
        >
          <PlannerIcon name="trash" className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}
