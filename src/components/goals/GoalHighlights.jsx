import Card from '../dashboard/Card.jsx';
import { categoryByKey, deadlineChip, getDeadline } from '../../utils/goals.js';

/** Friendly message that rewards consistency, never perfection. */
function getMessage({ total, active, completed, overdue, overall }) {
  if (total === 0) return 'Every big dream starts with one small goal. Add your first one whenever you’re ready 🌱';
  if (overdue.length > 0) {
    return 'A deadline slipped past? That’s okay. Adjust the date, shrink the next step, and keep going. Consistency matters more than perfection 💜';
  }
  if (active.length === 0 && completed.length > 0) return 'Look at everything you’ve reached. Take a breath, then plant something new when you feel ready 🌸';
  if (overall.percent === null) return 'Break a goal into tiny steps and watch it feel lighter. One step is enough for today 🌷';
  if (overall.percent >= 75) return 'You’re so close! Keep the same gentle pace. You’ve got this 🌼';
  if (overall.percent >= 25) return 'Steady steps add up. You’re building something real, one small action at a time 🌿';
  return 'Starting is the hardest part, and you’ve begun. Small, regular steps beat rare big ones 🌱';
}

/** Motivation + upcoming/overdue deadlines, side by side. */
export default function GoalHighlights({ stats, today }) {
  const attention = [...stats.overdue, ...stats.dueSoon.filter((g) => !stats.overdue.includes(g))]
    .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
    .slice(0, 5);

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
      <Card title="A gentle reminder" subtitle="Progress, not perfection" className="bg-gradient-to-br from-blush-100/80 to-lilac-100/80">
        <p className="text-base leading-relaxed text-ink-700">{getMessage(stats)}</p>
      </Card>

      <Card title="Deadlines to watch" subtitle="Overdue and due within 7 days">
        {attention.length === 0 ? (
          <p className="rounded-2xl bg-lilac-100/60 px-4 py-3 text-sm text-ink-600">
            {stats.active.length === 0
              ? 'No active goals to watch right now.'
              : 'Nothing urgent. Your deadlines look calm 🌤️'}
          </p>
        ) : (
          <ul className="space-y-2">
            {attention.map((g) => {
              const d = getDeadline(g.targetDate, today);
              const cat = categoryByKey[g.category];
              return (
                <li key={g.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-3.5 py-2.5">
                  <span className="min-w-0 truncate text-sm font-bold text-ink-700">
                    <span aria-hidden="true">{cat?.emoji} </span>
                    {g.title}
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${deadlineChip[d.state]}`}>
                    {d.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
