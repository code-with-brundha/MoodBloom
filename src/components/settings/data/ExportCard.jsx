import { useState } from 'react';
import Card from '../../dashboard/Card.jsx';
import Button from '../../Button.jsx';
import ExportDialog from './ExportDialog.jsx';
import StatusLine from './StatusLine.jsx';
import { EXPORT_FILENAME, buildExport, downloadJson } from '../../../utils/dataManagement.js';

/** Export my data: explanation first, then a JSON download of what is saved in this browser. */
export default function ExportCard({ overview }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const anything = Object.values(overview).some((d) => d.stored);

  const handleExport = () => {
    setOpen(false);
    const built = buildExport();
    if (!built.ok) {
      setStatus({
        type: 'error',
        text:
          built.error === 'empty'
            ? 'There’s nothing saved in this browser to export yet.'
            : 'Something went wrong while preparing your file. Nothing was changed. Please try again.',
      });
      return;
    }
    const result = downloadJson(built.payload, EXPORT_FILENAME);
    setStatus(
      result.ok
        ? { type: 'success', text: `Your download of ${EXPORT_FILENAME} has started. Keep it somewhere safe.` }
        : { type: 'error', text: 'Your browser wouldn’t start the download. Nothing was changed. Please try again.' },
    );
  };

  return (
    <>
    <Card
      title="Export my data"
      subtitle="Download a copy of what MoodBloom has saved in this browser as a JSON file."
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-600">
          You’ll see exactly what the file contains before it downloads. It only includes data saved in this browser,
          never cloud data, because MoodBloom doesn’t use the cloud yet.
        </p>
        {!anything && (
          <p data-testid="export-empty" className="rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm text-ink-700">
            There’s nothing saved in this browser to export yet. Add a goal, a planner event or a bucket-list dream
            first, or change a setting.
          </p>
        )}
        <Button type="button" onClick={() => setOpen(true)} disabled={!anything} className="py-2.5">
          Export my data
        </Button>
        <StatusLine status={status} testId="export-status" />
      </div>
    </Card>
    {/* Rendered outside the Card: its backdrop blur would otherwise trap a fixed dialog inside the card */}
    {open && <ExportDialog overview={overview} onConfirm={handleExport} onCancel={() => setOpen(false)} />}
    </>
  );
}
