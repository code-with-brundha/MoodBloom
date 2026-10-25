import Card from '../dashboard/Card.jsx';
import StatCard from '../insights/StatCard.jsx';

function getMessage({ total, completed, percent }) {
  if (total === 0) return 'Every adventure starts as a tiny wish. Add your first one whenever you’re ready 🌱';
  if (completed === total) return 'Every dream on your list has come true! Time to dream even bigger 🌟';
  if (completed === 0) return 'Your list is full of possibility. Pick one dream and take the smallest first step 🌷';
  if (percent >= 50) return 'You’re more than halfway there. Look at everything you’ve already lived 🌸';
  return 'Every dream you’ve fulfilled is a story worth keeping. Keep going at your own pace 💜';
}

/** Top-of-page dashboard: counts + overall completion progress. */
export default function BucketStats({ stats }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard emoji="🌟" label="Total dreams" value={stats.total} hint="On your list" />
        <StatCard emoji="🌱" label="Planned" value={stats.planned} hint="Waiting for their moment" />
        <StatCard emoji="🚀" label="In progress" value={stats.inprogress} hint="Underway right now" />
        <StatCard emoji="🎉" label="Completed" value={stats.completed} hint="Dreams come true" />
      </div>

      <Card className="bg-gradient-to-br from-blush-100/80 to-lilac-100/80">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-ink-500">Overall completion</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-800">
              {stats.completed} of {stats.total} {stats.total === 1 ? 'dream' : 'dreams'} fulfilled
            </p>
          </div>
          <p className="font-display text-3xl font-semibold text-lilac-500">{stats.percent}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Bucket list completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stats.percent}
          className="mt-4 h-3.5 overflow-hidden rounded-full bg-white/70"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 transition-all duration-500 ease-out"
            style={{ width: `${stats.percent}%` }}
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-600">{getMessage(stats)}</p>
      </Card>
    </div>
  );
}
