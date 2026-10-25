/**
 * Progress bar for one goal. With no milestones it does NOT show 0%;
 * it invites the user to add steps instead.
 */
export default function GoalProgress({ progress, canAddSteps, onAddSteps, label }) {
  if (progress.total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-lilac-300 bg-lilac-100/50 px-4 py-3">
        <p className="text-sm font-semibold text-ink-600">No steps yet, so there’s no progress to show.</p>
        {canAddSteps && (
          <button
            type="button"
            onClick={onAddSteps}
            className="mt-1 text-sm font-bold text-lilac-500 underline decoration-lilac-300 underline-offset-2 hover:text-lilac-400"
          >
            + Add steps to start tracking
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-bold text-ink-600">
          {progress.done} of {progress.total} {progress.total === 1 ? 'step' : 'steps'} done
        </p>
        <p className="font-display text-xl font-semibold text-lilac-500">{progress.percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        className="mt-1.5 h-3 overflow-hidden rounded-full bg-lilac-100"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 transition-all duration-500 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}
