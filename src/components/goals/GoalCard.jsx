import { useState } from 'react';
import GoalIcon from './GoalIcon.jsx';
import GoalProgress from './GoalProgress.jsx';
import MilestoneList from './MilestoneList.jsx';
import LinkedTasks from './LinkedTasks.jsx';
import { categoryByKey, deadlineChip, getDeadline, getProgress } from '../../utils/goals.js';
import { formatEntryDate } from '../../utils/dates.js';

const actionBtn =
  'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold transition';

/** One goal: summary, progress, expandable steps + linked tasks, and status actions. */
export default function GoalCard({ goal, today, actions }) {
  const [open, setOpen] = useState(false);
  const category = categoryByKey[goal.category];
  const progress = getProgress(goal);
  const isActive = goal.status === 'active';
  const readOnly = !isActive;
  const deadline = isActive ? getDeadline(goal.targetDate, today) : null;
  const allStepsDone = isActive && progress.total > 0 && progress.done === progress.total;

  return (
    <li className="rounded-3xl border border-white/80 bg-white/70 p-5 shadow-soft backdrop-blur-md transition sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${category.chip}`}>
                {category.emoji} {category.label}
              </span>
            )}
            {deadline && (
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${deadlineChip[deadline.state]}`}>
                {deadline.state === 'overdue' ? '⏰ ' : ''}
                {deadline.label}
              </span>
            )}
            {goal.status === 'completed' && (
              <span className="rounded-full bg-gradient-to-r from-blush-200 to-lilac-200 px-2.5 py-1 text-xs font-bold text-ink-800">
                🎉 Completed
              </span>
            )}
            {goal.status === 'archived' && (
              <span className="rounded-full bg-cream-200 px-2.5 py-1 text-xs font-bold text-ink-600">📦 Archived</span>
            )}
          </div>
          <h3 className="mt-2.5 break-words text-xl font-semibold">{goal.title}</h3>
        </div>

        <div className="flex shrink-0 gap-1">
          {isActive && (
            <button
              type="button"
              onClick={() => actions.onEdit(goal)}
              aria-label={`Edit goal "${goal.title}"`}
              className="rounded-full p-2 text-ink-600 transition hover:bg-lilac-100"
            >
              <GoalIcon name="edit" className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => actions.onDelete(goal)}
            aria-label={`Delete goal "${goal.title}"`}
            className="rounded-full p-2 text-blush-500 transition hover:bg-blush-100"
          >
            <GoalIcon name="trash" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {goal.description && (
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">{goal.description}</p>
      )}

      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-500">
        <span className="inline-flex items-center gap-1">
          <GoalIcon name="calendar" className="h-3.5 w-3.5" />
          {formatEntryDate(goal.startDate)} → {formatEntryDate(goal.targetDate)}
        </span>
        {goal.status === 'completed' && goal.completedAt && (
          <span>Completed {formatEntryDate(goal.completedAt.slice(0, 10))}</span>
        )}
      </p>

      <div className="mt-4">
        <GoalProgress
          progress={progress}
          label={`Progress for ${goal.title}`}
          canAddSteps={isActive}
          onAddSteps={() => setOpen(true)}
        />
      </div>

      {allStepsDone && (
        <p className="mt-3 rounded-2xl bg-lilac-100/70 px-4 py-2.5 text-sm font-semibold text-ink-700">
          🌸 Every step is done. Ready to mark this goal as completed?
        </p>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`goal-details-${goal.id}`}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-sm font-bold text-lilac-500 transition hover:text-lilac-400"
      >
        <GoalIcon name="chevron" className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
        {open ? 'Hide steps & tasks' : `Steps & tasks (${progress.total + goal.linkedTasks.length})`}
      </button>

      {open && (
        <div id={`goal-details-${goal.id}`} className="mt-3 space-y-5 border-t border-lilac-100 pt-4">
          <section aria-label="Steps">
            <h4 className="mb-2 font-display text-base font-semibold text-ink-800">Steps</h4>
            <MilestoneList
              goalId={goal.id}
              milestones={goal.milestones}
              readOnly={readOnly}
              onAdd={(title) => actions.onAddMilestone(goal.id, title)}
              onToggle={(id) => actions.onToggleMilestone(goal.id, id)}
              onEdit={(id, title) => actions.onEditMilestone(goal.id, id, title)}
              onDelete={(id) => actions.onDeleteMilestone(goal.id, id)}
            />
          </section>

          <section aria-label="Linked daily tasks">
            <h4 className="mb-1 font-display text-base font-semibold text-ink-800">Linked daily tasks</h4>
            <LinkedTasks
              goalId={goal.id}
              tasks={goal.linkedTasks}
              readOnly={readOnly}
              onAdd={(values) => actions.onAddTask(goal.id, values)}
              onToggle={(id) => actions.onToggleTask(goal.id, id)}
              onDelete={(id) => actions.onDeleteTask(goal.id, id)}
            />
          </section>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 border-t border-lilac-100 pt-4">
        {goal.status === 'active' && (
          <>
            <button
              type="button"
              onClick={() => actions.onComplete(goal)}
              className={`${actionBtn} ${
                allStepsDone
                  ? 'bg-gradient-to-r from-blush-300 to-lilac-300 text-ink-800 shadow-petal hover:-translate-y-0.5'
                  : 'border-2 border-lilac-300 bg-white/70 text-ink-700 hover:bg-lilac-100'
              }`}
            >
              <GoalIcon name="check" className="h-4 w-4" /> Mark completed
            </button>
            <button
              type="button"
              onClick={() => actions.onArchive(goal)}
              className={`${actionBtn} text-ink-600 hover:bg-lilac-100`}
            >
              <GoalIcon name="archive" className="h-4 w-4" /> Archive
            </button>
          </>
        )}
        {goal.status === 'completed' && (
          <>
            <button
              type="button"
              onClick={() => actions.onReopen(goal)}
              className={`${actionBtn} border-2 border-lilac-300 bg-white/70 text-ink-700 hover:bg-lilac-100`}
            >
              <GoalIcon name="restore" className="h-4 w-4" /> Reopen
            </button>
            <button
              type="button"
              onClick={() => actions.onArchive(goal)}
              className={`${actionBtn} text-ink-600 hover:bg-lilac-100`}
            >
              <GoalIcon name="archive" className="h-4 w-4" /> Archive
            </button>
          </>
        )}
        {goal.status === 'archived' && (
          <button
            type="button"
            onClick={() => actions.onReopen(goal)}
            className={`${actionBtn} border-2 border-lilac-300 bg-white/70 text-ink-700 hover:bg-lilac-100`}
          >
            <GoalIcon name="restore" className="h-4 w-4" /> Restore to active
          </button>
        )}
      </div>
    </li>
  );
}
