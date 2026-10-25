import Card from '../dashboard/Card.jsx';
import { HiddenNote, RevealButton, usePrivateView } from '../../utils/privateView.jsx';

/** Positive highlights from the period, plus a few bright moments from the user's own notes. */
export default function PositiveHighlights({ highlights, brightMoments, moodByKey }) {
  const view = usePrivateView();

  return (
    <Card title="Positive highlights" subtitle="The good stuff worth remembering.">
      {highlights.length === 0 ? (
        <p className="rounded-2xl bg-lilac-100/60 px-4 py-8 text-center text-ink-600">
          Your highlights will show up once you log a few moods. 🌸
        </p>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {highlights.map((h) => (
              <li key={h.title} className="flex gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
                <span aria-hidden="true" className="text-2xl">
                  {h.emoji}
                </span>
                <div>
                  <p className="font-bold text-ink-800">{h.title}</p>
                  <p className="mt-0.5 text-sm text-ink-600">{h.text}</p>
                </div>
              </li>
            ))}
          </ul>

          {brightMoments.length > 0 && (
            <div className="mt-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold">Bright moments you noted</h3>
                <RevealButton view={view} />
              </div>
              <ul className="mt-2 space-y-2">
                {brightMoments.map((l) => (
                  <li key={l.id} className="flex items-start gap-3 rounded-2xl bg-lilac-100/60 px-4 py-3 text-sm">
                    <span aria-hidden="true" className="text-xl">
                      {moodByKey[l.mood].emoji}
                    </span>
                    {view.hidden ? <HiddenNote /> : <span className="text-ink-700">{l.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
