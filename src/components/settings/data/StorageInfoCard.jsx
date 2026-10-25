import Card from '../../dashboard/Card.jsx';

const POINTS = [
  'MoodBloom currently keeps its data in your browser’s local storage, for the features that save anything so far.',
  'Data saved in the browser can be lost if you clear your browser’s storage or site data, or if you use a different browser or device.',
  'Local browser storage is not the same as encrypted cloud storage, and it isn’t a secure backup. Use “Export my data” to keep a copy somewhere safe.',
  'Cloud sync and account-specific data management will be added when real accounts and a backend are connected.',
];

/** Plain-language explanation of where data lives. No fake storage meter, no encryption claims. */
export default function StorageInfoCard() {
  return (
    <Card title="About storage" subtitle="Where your data lives today">
      <ul className="space-y-2.5">
        {POINTS.map((text) => (
          <li key={text} className="flex gap-3 text-sm leading-relaxed text-ink-700">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lilac-400" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
