import Card from '../dashboard/Card.jsx';

/** How often each mood appeared, as ranked bars. */
export default function MoodDistribution({ ranked, moodByKey }) {
  return (
    <Card title="Mood breakdown" subtitle="How your check-ins were spread out.">
      {ranked.length === 0 ? (
        <p className="rounded-2xl bg-lilac-100/60 px-4 py-8 text-center text-ink-600">Nothing to show yet. 🌱</p>
      ) : (
        <ul className="space-y-3">
          {ranked.map(({ mood, count, share }) => (
            <li key={mood} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 font-semibold text-ink-700 sm:w-28">
                {moodByKey[mood].emoji} {moodByKey[mood].label}
              </span>
              <span
                className="h-3 flex-1 overflow-hidden rounded-full bg-lilac-100"
                role="img"
                aria-label={`${moodByKey[mood].label}: ${count} (${share}%)`}
              >
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 transition-all duration-500"
                  style={{ width: `${share}%` }}
                />
              </span>
              <span className="w-16 shrink-0 text-right text-ink-500">
                {count} <span className="text-xs">({share}%)</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
