import StatCard from '../insights/StatCard.jsx';

/** Four overview cards: total, active, completed and overall step progress. */
export default function GoalStats({ stats }) {
  const { overall } = stats;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard emoji="🎯" label="Total goals" value={stats.total} hint={stats.archived.length ? `${stats.archived.length} archived` : 'All your goals'} />
      <StatCard emoji="🌱" label="Active" value={stats.active.length} hint="In progress" />
      <StatCard emoji="🎉" label="Completed" value={stats.completed.length} hint="Goals you’ve reached" />
      <StatCard
        emoji="🌸"
        label="Overall progress"
        value={overall.percent === null ? '—' : `${overall.percent}%`}
        hint={
          overall.percent === null
            ? 'Add steps to see progress'
            : `${overall.done} of ${overall.total} steps done`
        }
      />
    </div>
  );
}
