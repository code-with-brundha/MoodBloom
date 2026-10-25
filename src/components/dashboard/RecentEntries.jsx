import Card from './Card.jsx';
import { HiddenNote, RevealButton, usePrivateView } from '../../utils/privateView.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

/** List of the latest journal entries. */
export default function RecentEntries({ entries, moods }) {
  const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));
  const view = usePrivateView();

  return (
    <Card
      title="Recent entries"
      subtitle="Your latest thoughts and stories."
      action={entries.length > 0 ? <RevealButton view={view} /> : null}
    >
      {entries.length === 0 ? (
        <p className="rounded-2xl bg-lilac-100/60 px-4 py-6 text-center text-ink-600">
          Nothing here yet. Your first entry will bloom here 🌱
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => {
            const mood = moodByKey[entry.mood];
            return (
              <li key={entry.id} className="rounded-2xl bg-white/80 p-4 transition hover:shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <time dateTime={entry.date} className="text-sm font-semibold text-ink-500">
                    {formatDate(entry.date)}
                  </time>
                  {mood && (
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${mood.chip}`}>
                      {mood.emoji} {mood.label}
                    </span>
                  )}
                </div>
                {view.hidden ? (
                  <HiddenNote className="mt-2 block" />
                ) : (
                  <>
                    <h3 className="mt-2 text-lg font-semibold">{entry.title}</h3>
                    <p className="mt-1 line-clamp-2 leading-relaxed text-ink-600">{entry.text}</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
