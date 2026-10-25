import Card from '../../dashboard/Card.jsx';
import { CATEGORIES, NOT_STORED } from '../../../utils/dataManagement.js';

const GROUPS = [
  { title: 'Content', keys: ['goals', 'planner', 'bucket'] },
  { title: 'Profile & settings', keys: ['profile', 'appearance', 'privacy', 'reminders'] },
];

/** What is really saved in this browser right now. Counts come straight from storage, nothing is estimated. */
export default function OverviewCard({ overview }) {
  const label = (key) => CATEGORIES.find((c) => c.key === key).label;

  return (
    <Card
      title="Your data in this browser"
      subtitle="Counted from what is actually saved here right now. Nothing is estimated."
    >
      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">{group.title}</h3>
            <dl className="mt-2 divide-y divide-lilac-200/60">
              {group.keys.map((key) => (
                <div key={key} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4">
                  <dt className="font-bold text-ink-800 sm:w-64 sm:shrink-0">{label(key)}</dt>
                  <dd data-testid={`overview-${key}`} className="text-ink-700">
                    {overview[key].text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">Not saved in this browser yet</h3>
          <dl className="mt-2 divide-y divide-lilac-200/60">
            {NOT_STORED.map((item) => (
              <div key={item.key} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4">
                <dt className="font-bold text-ink-800 sm:w-64 sm:shrink-0">{item.label}</dt>
                <dd data-testid={`overview-${item.key}`} className="text-ink-700">
                  Sample data only, so there is nothing to count
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-700">
            The journal, mood tracker and daily to-do list show sample data that resets whenever you refresh. They
            don’t save anything yet, so they can’t be exported, imported or cleared here. This will change when real
            data storage is connected.
          </p>
        </div>
      </div>
    </Card>
  );
}
