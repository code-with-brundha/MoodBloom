import Card from '../../dashboard/Card.jsx';

const POINTS = [
  'MoodBloom uses Supabase to store account data for supported features. Other features may still keep data in your browser.',
  'Browser-stored data may be lost if you clear your browser storage or site data, or use a different browser or device.',
  'Use “Export account data (JSON)” to download a copy of the records supported by the account export. Keep exported files somewhere private and secure.',
  'Data access depends on the feature and its storage setup. Account data is protected by authentication and database permissions where configured.',
];

/** Plain-language explanation of where data lives. */
export default function StorageInfoCard() {
  return (
    <Card title="About storage" subtitle="Where your data lives">
      <ul className="space-y-2.5">
        {POINTS.map((text) => (
          <li
            key={text}
            className="flex gap-3 text-sm leading-relaxed text-ink-700"
          >
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lilac-400"
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}