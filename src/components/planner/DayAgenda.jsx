import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import PlanCard from './PlanCard.jsx';
import PlannerIcon from './PlannerIcon.jsx';
import { eventTypeByKey, fullDateLabel, plural } from '../../utils/planner.js';

/** Agenda for the selected day: count, chronological plans, and a friendly empty state. */
export default function DayAgenda({ dateKey, todayKey, plans, typeFilter, hiddenCount, onAdd, onEdit, onDelete, onClearFilter }) {
  const filterLabel = typeFilter !== 'all' ? eventTypeByKey[typeFilter].label : '';

  return (
    <Card
      title={
        <span className="flex flex-wrap items-center gap-2">
          {fullDateLabel(dateKey)}
          {dateKey === todayKey && (
            <span className="rounded-full bg-gradient-to-r from-blush-200 to-lilac-200 px-2.5 py-0.5 font-sans text-xs font-bold text-ink-800">
              Today
            </span>
          )}
        </span>
      }
      subtitle={`${plural(plans.length, 'plan')} scheduled${filterLabel ? ` · showing ${filterLabel} only` : ''}`}
      action={
        <Button type="button" onClick={() => onAdd(dateKey)} className="shrink-0 px-4 py-2 text-sm">
          <PlannerIcon name="plus" className="h-4 w-4" /> Add plan
        </Button>
      }
    >
      {plans.length > 0 ? (
        <ul className="space-y-3">
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl bg-lilac-100/50 px-5 py-10 text-center">
          <p className="text-4xl" aria-hidden="true">
            {hiddenCount > 0 ? '🔎' : '🌿'}
          </p>
          <h3 className="mt-3 text-lg font-semibold">
            {hiddenCount > 0 ? `No ${filterLabel} plans on this day` : 'Nothing planned for this day'}
          </h3>
          <p className="mx-auto mt-1.5 max-w-xs text-sm text-ink-600">
            {hiddenCount > 0
              ? `${plural(hiddenCount, 'plan')} of other types ${hiddenCount === 1 ? 'is' : 'are'} hidden by your filter.`
              : 'A quiet day is a good day. Add a plan whenever you’re ready.'}
          </p>
          {hiddenCount > 0 ? (
            <Button type="button" variant="secondary" onClick={onClearFilter} className="mt-4 py-2 text-sm">
              Show all types
            </Button>
          ) : (
            <Button type="button" onClick={() => onAdd(dateKey)} className="mt-4 py-2 text-sm">
              <PlannerIcon name="plus" className="h-4 w-4" /> Add a plan
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
