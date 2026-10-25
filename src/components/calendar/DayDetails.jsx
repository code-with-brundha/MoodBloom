import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import JournalIcon from '../journal/JournalIcon.jsx';
import { formatEntryDate } from '../../utils/dates.js';
import { HiddenNote, RevealButton, usePrivateView } from '../../utils/privateView.jsx';

/** Everything recorded on the selected date, plus quick-add buttons. */
export default function DayDetails({ dateKey, todayKey, moodLogs, entries, moodByKey, onAddMood, onAddJournal }) {
  const isFuture = dateKey > todayKey;
  const isEmpty = moodLogs.length === 0 && entries.length === 0;
  const view = usePrivateView();

  return (
    <Card
      title={formatEntryDate(dateKey)}
      subtitle={dateKey === todayKey ? 'Today' : isFuture ? 'Upcoming day' : undefined}
      action={!isEmpty ? <RevealButton view={view} /> : null}
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Button type="button" onClick={onAddMood} disabled={isFuture} className="py-2.5">
          <JournalIcon name="plus" /> Add mood
        </Button>
        <Button type="button" variant="secondary" onClick={onAddJournal} disabled={isFuture} className="py-2.5">
          <JournalIcon name="plus" /> Add journal
        </Button>
      </div>
      {isFuture && (
        <p className="mt-2 text-sm text-ink-500">You can add moods and entries once this day arrives.</p>
      )}

      {isEmpty && (
        <p className="mt-5 rounded-2xl bg-lilac-100/60 px-4 py-6 text-center text-ink-600">
          Nothing recorded for this day. 🌱
        </p>
      )}

      {moodLogs.length > 0 && (
        <section className="mt-5" aria-label="Moods">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Mood</h3>
          <ul className="mt-2 space-y-2">
            {moodLogs.map((log) => {
              const mood = moodByKey[log.mood];
              return (
                <li key={log.id} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3">
                  <span className="text-2xl" aria-hidden="true">
                    {mood?.emoji}
                  </span>
                  <div className="min-w-0">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${mood?.chip}`}>{mood?.label}</span>
                    {log.note &&
                      (view.hidden ? (
                        <HiddenNote className="mt-1 block text-sm" />
                      ) : (
                        <p className="mt-1 break-words text-sm text-ink-600">{log.note}</p>
                      ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {entries.length > 0 && (
        <section className="mt-5" aria-label="Journal entries">
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-500">Journal</h3>
          <ul className="mt-2 space-y-2">
            {entries.map((entry) => {
              const mood = moodByKey[entry.mood];
              return (
                <li key={entry.id} className="rounded-2xl bg-white/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {view.hidden ? (
                      <HiddenNote />
                    ) : (
                      <h4 className="break-words font-display text-lg font-semibold text-ink-800">{entry.title}</h4>
                    )}
                    {mood && (
                      <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${mood.chip}`}>
                        {mood.emoji} {mood.label}
                      </span>
                    )}
                  </div>
                  {!view.hidden && (
                    <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-relaxed text-ink-600">
                      {entry.text}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Card>
  );
}
