import Card from '../../dashboard/Card.jsx';
import { CATEGORIES } from '../../../utils/dataManagement.js';

const GROUPS = [
  { title: 'Content', keys: ['goals', 'planner', 'bucket'] },
  {
    title: 'Profile & settings',
    keys: ['profile', 'appearance', 'privacy', 'reminders'],
  },
];

/** Shows what is really saved in this browser right now. */
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
            <h3 className="text-sm font-bold uppercase tracking-wide text-ink-700">
              {group.title}
            </h3>

            <dl className="mt-2 divide-y divide-lilac-200/60">
              {group.keys.map((key) => (
                <div
                  key={key}
                  className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <dt className="font-bold text-ink-800 sm:w-64 sm:shrink-0">
                    {label(key)}
                  </dt>

                  <dd
                    data-testid={`overview-${key}`}
                    className="text-ink-700"
                  >
                    {overview[key].text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Card>
  );
}
