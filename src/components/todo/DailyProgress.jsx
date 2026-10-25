import Card from '../dashboard/Card.jsx';

/** Pick a gentle message. It celebrates effort and never demands perfection. */
function getMessage({ total, completed, isFuture }) {
  if (total === 0) return 'A blank page is a soft place to begin. Add one small thing you’d like to do.';
  if (completed === total) return 'You showed up for yourself today. That’s what matters, so rest well 💜';
  if (completed === 0) {
    return isFuture
      ? 'A little planning is a kind gift to your future self 🌷'
      : 'Starting is the hardest part. Pick one small task and begin there 🌱';
  }
  return 'Every step counts. You’re making progress, and progress is enough 🌸';
}

/** Progress bar + completed count + motivational message for the selected day. */
export default function DailyProgress({ total, completed, isFuture }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-ink-500">Daily progress</p>
          <p className="mt-1 text-2xl font-semibold text-ink-800 font-display">
            {completed} of {total} {total === 1 ? 'task' : 'tasks'} completed
          </p>
        </div>
        <p className="text-3xl font-semibold text-lilac-500 font-display">{percent}%</p>
      </div>

      <div
        role="progressbar"
        aria-label="Tasks completed"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-4 h-3.5 overflow-hidden rounded-full bg-lilac-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-4 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-600">
        {getMessage({ total, completed, isFuture })}
      </p>
    </Card>
  );
}
