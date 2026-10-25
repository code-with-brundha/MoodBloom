import { useState } from 'react';
import Card from '../../dashboard/Card.jsx';
import Button from '../../Button.jsx';
import CheckRow from './CheckRow.jsx';
import StatusLine from './StatusLine.jsx';
import ClearDialog from './ClearDialog.jsx';
import { CATEGORIES, clearCategories, hasContent } from '../../../utils/dataManagement.js';

/** Clear local demo data: choose categories, confirm, remove only those MoodBloom keys. */
export default function ClearCard({ overview, onDone }) {
  const [picked, setPicked] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState(null);

  const clearable = CATEGORIES.filter((c) => hasContent(overview[c.key]));
  const selected = clearable.filter((c) => picked.includes(c.key)); // ignores anything that has since been cleared

  const toggle = (key, on) => setPicked((prev) => (on ? [...new Set([...prev, key])] : prev.filter((k) => k !== key)));

  const handleConfirm = () => {
    const keys = selected.map((c) => c.key);
    const result = clearCategories(keys);
    setConfirming(false);
    setPicked([]);
    onDone();
    if (result.ok) {
      setStatus({
        type: 'success',
        text: `Cleared from this browser: ${selected.map((c) => c.label).join(', ')}. Everything else was left as it was.`,
      });
    } else {
      setStatus({
        type: 'error',
        text: 'Some data couldn’t be cleared because the browser refused. Please try again.',
      });
    }
  };

  return (
    <>
    <Card
      title="Clear local demo data"
      subtitle="Remove data MoodBloom saved in this browser. Choose exactly what to clear."
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-ink-600">
          This only affects data saved in this browser. It never touches cloud records or a real account (there are
          none yet), and it never touches other websites’ data. Nothing is cleared until you confirm.
        </p>

        <fieldset>
          <legend className="sr-only">Choose data to clear</legend>
          <div className="space-y-2">
            {CATEGORIES.map((c) => {
              const canClear = hasContent(overview[c.key]);
              return (
                <CheckRow
                  key={c.key}
                  id={`clear-${c.key}`}
                  testId={`clear-${c.key}`}
                  checked={canClear && picked.includes(c.key)}
                  disabled={!canClear}
                  onChange={(on) => toggle(c.key, on)}
                  label={c.label}
                  description={canClear ? overview[c.key].text : 'Nothing saved, so there is nothing to clear'}
                />
              );
            })}
          </div>
        </fieldset>

        <p className="text-sm text-ink-600">
          Journal entries, mood records and to-do tasks aren’t saved in this browser yet, so they aren’t listed here.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={selected.length === 0}
            className="py-2.5"
          >
            Clear selected data…
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPicked(clearable.map((c) => c.key))}
            disabled={clearable.length === 0}
            className="py-2.5"
          >
            Select everything that’s saved
          </Button>
        </div>

        <StatusLine status={status} testId="clear-status" />
      </div>
    </Card>
    {confirming && (
      <ClearDialog
        items={selected.map((c) => ({ key: c.key, label: c.label, text: overview[c.key].text }))}
        onConfirm={handleConfirm}
        onCancel={() => setConfirming(false)}
      />
    )}
    </>
  );
}
