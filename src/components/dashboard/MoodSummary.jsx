import Card from './Card.jsx';

/** Simple look at the last 7 days, based only on moods actually logged. */
export default function MoodSummary({ week, moods }) {
  const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));
  const loggedDays = week.filter((d) => d.mood && moodByKey[d.mood]);
  const counts = loggedDays.reduce((acc, d) => ({ ...acc, [d.mood]: (acc[d.mood] || 0) + 1 }), {});
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = moodByKey[ranked[0]?.[0]];

  return (
    <Card title="This week's moods" subtitle="A quick look at the last 7 days.">
      <ul className="flex justify-between gap-1">
        {week.map((d, i) => {
          const mood = moodByKey[d.mood];
          return (
            <li key={`${d.day}-${i}`} className="flex flex-col items-center gap-1.5">
              <span title={mood?.label ?? 'No mood logged'} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl shadow-sm sm:h-11 sm:w-11">
                {mood?.emoji ?? '·'}
              </span>
              <span className="text-xs font-semibold text-ink-500">{d.day}</span>
            </li>
          );
        })}
      </ul>
      {top && <p className="mt-5 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm text-ink-700">
        Mostly <strong>{top.label.toLowerCase()}</strong> this week {top.emoji}
      </p>}
      {ranked.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-lilac-100/60 px-4 py-4 text-sm text-ink-600">Your mood summary will appear here as you log moods.</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {ranked.map(([key, count]) => (
            <li key={key} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 font-semibold text-ink-700">{moodByKey[key].emoji} {moodByKey[key].label}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-lilac-100">
                <span className="block h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300" style={{ width: `${(count / loggedDays.length) * 100}%` }} />
              </span>
              <span className="w-4 text-right text-ink-500">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
