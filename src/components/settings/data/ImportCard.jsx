import { useMemo, useState } from 'react';
import Card from '../../dashboard/Card.jsx';
import Button from '../../Button.jsx';
import CheckRow from './CheckRow.jsx';
import StatusLine from './StatusLine.jsx';
import ImportConfirmDialog from './ImportConfirmDialog.jsx';
import { MAX_IMPORT_BYTES, applyImport, parseImportText, planImport } from '../../../utils/dataManagement.js';

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** One plain-language line describing what importing a category will do. */
function describePlan(p, mode) {
  if (p.kind === 'single') return p.hasExisting ? `Replaces your saved ${p.label.toLowerCase()}` : 'New: nothing saved yet, so nothing is replaced';
  if (p.incoming === 0) return 'Nothing to import';
  if (mode === 'replace') {
    return p.existing > 0
      ? `Replaces your ${p.existing} current with ${p.incoming} from the file`
      : `Adds ${p.incoming} (you have none saved yet)`;
  }
  const parts = [`Adds ${p.add} new`];
  if (p.skip > 0) parts.push(`skips ${p.skip} already here`);
  return parts.join(', ');
}

/** Import my data: pick a file, check it, preview it, choose what to import, confirm. */
export default function ImportCard({ onDone }) {
  const [parsed, setParsed] = useState(null);
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState('merge');
  const [selected, setSelected] = useState([]);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState(null);
  const [inputKey, setInputKey] = useState(0); // changing it lets the same file be chosen again

  const plan = useMemo(
    () => (parsed ? planImport(parsed, mode).map((p) => ({ ...p, line: describePlan(p, mode) })) : []),
    [parsed, mode],
  );
  const chosen = plan.filter((p) => selected.includes(p.key));

  const reset = () => {
    setParsed(null);
    setFileName('');
    setSelected([]);
    setMode('merge');
    setConfirming(false);
    setInputKey((k) => k + 1);
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus(null);
    setParsed(null);
    setConfirming(false);
    if (file.size > MAX_IMPORT_BYTES) {
      setStatus({ type: 'error', text: 'That file is bigger than 5 MB, so it can’t be a MoodBloom export.' });
      setInputKey((k) => k + 1);
      return;
    }
    let text;
    try {
      text = await file.text();
    } catch {
      setStatus({ type: 'error', text: 'We couldn’t read that file. Please try again or choose another one.' });
      setInputKey((k) => k + 1);
      return;
    }
    const result = parseImportText(text, file.size);
    if (!result.ok) {
      setStatus({ type: 'error', text: result.error });
      setInputKey((k) => k + 1);
      return;
    }
    const initial = planImport(result, 'merge')
      .filter((p) => p.incoming > 0 && (p.kind === 'list' || !p.hasExisting))
      .map((p) => p.key);
    setParsed(result);
    setFileName(file.name);
    setSelected(initial);
  };

  const toggle = (key, on) => setSelected((prev) => (on ? [...new Set([...prev, key])] : prev.filter((k) => k !== key)));

  const handleConfirm = () => {
    const result = applyImport(parsed, selected, mode);
    setConfirming(false);
    if (!result.ok) {
      setStatus({ type: 'error', text: result.error });
      return;
    }
    const lines = result.applied.map((a) => {
      const isList = ['goals', 'planner', 'bucket'].includes(a.key);
      let text;
      if (!isList) text = a.replaced ? 'replaced with the file’s version' : 'saved';
      else if (mode === 'replace') text = a.replaced ? `replaced your ${a.replaced} with ${a.added} from the file` : `${a.added} added`;
      else text = `${a.added} added${a.skipped ? `, ${a.skipped} already here (skipped)` : ''}`;
      return `${a.label}: ${text}`;
    });
    setStatus({ type: 'success', text: 'Import complete. Your data is saved in this browser.', lines });
    reset();
    onDone();
  };

  return (
    <>
    <Card
      title="Import my data"
      subtitle="Restore data from a file you exported from MoodBloom. You’ll preview it before anything changes."
    >
      <div className="space-y-4">
        <div>
          <input
            key={inputKey}
            id="import-file"
            type="file"
            accept=".json,application/json"
            onChange={handleFile}
            className="peer sr-only"
          />
          <label
            htmlFor="import-file"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-lilac-300 bg-white/70 px-7 py-2.5 text-base font-bold text-ink-700 transition hover:-translate-y-0.5 hover:bg-lilac-100 peer-focus-visible:ring-4 peer-focus-visible:ring-lilac-200"
          >
            Choose a MoodBloom file
          </label>
          <p className="mt-2 text-sm text-ink-600">
            Only .json files exported with “Export my data”, up to 5 MB. Journal, mood and to-do data can’t be
            imported because MoodBloom doesn’t save them yet.
          </p>
        </div>

        <StatusLine status={status} testId="import-status">
          {status?.lines && (
            <ul className="mt-1 list-disc space-y-0.5 pl-5 font-normal" data-testid="import-result">
              {status.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          )}
        </StatusLine>

        {parsed && (
          <div className="space-y-4 border-t border-lilac-200/60 pt-4" data-testid="import-preview">
            <div>
              <h3 className="text-lg font-semibold">Preview</h3>
              <p className="text-sm text-ink-600">
                <span data-testid="import-filename">{fileName}</span>
                {parsed.exportedAt && <> · exported {new Date(parsed.exportedAt).toLocaleString()}</>}
              </p>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-bold text-ink-700">How should it be added?</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ['merge', 'Add to what I have', 'Keeps everything you already have. Items that are already here are skipped, so nothing is duplicated.'],
                  ['replace', 'Replace what I have', 'For each ticked category, your current data is swapped for the file’s version.'],
                ].map(([value, title, text]) => (
                  <label
                    key={value}
                    htmlFor={`import-mode-${value}`}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 px-4 py-3 ${
                      mode === value ? 'border-lilac-400 bg-lilac-100/70' : 'border-lilac-200/70 bg-white/60'
                    }`}
                  >
                    <input
                      id={`import-mode-${value}`}
                      type="radio"
                      name="import-mode"
                      value={value}
                      checked={mode === value}
                      onChange={() => setMode(value)}
                      className="mt-1 h-5 w-5 shrink-0 accent-lilac-500"
                    />
                    <span>
                      <span className="block font-bold text-ink-800">{title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-600">{text}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-bold text-ink-700">What do you want to import?</legend>
              <div className="space-y-2">
                {plan.map((p) => (
                  <CheckRow
                    key={p.key}
                    id={`import-${p.key}`}
                    testId={`import-${p.key}`}
                    checked={selected.includes(p.key)}
                    disabled={p.incoming === 0}
                    onChange={(on) => toggle(p.key, on)}
                    label={`${p.label}${p.kind === 'list' ? ` (${plural(p.incoming, 'item')} in file)` : ''}`}
                    description={
                      <>
                        {p.line}
                        {p.invalid > 0 && ` · ${plural(p.invalid, 'incomplete item')} in the file will be ignored`}
                        {p.note && ` · ${p.note}`}
                      </>
                    }
                  />
                ))}
              </div>
            </fieldset>

            <p className="rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-700">
              Importing can add to or replace what you have now. Nothing changes until you confirm. If you’re unsure,
              export your current data first.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="secondary" onClick={reset} className="py-2.5">
                Cancel import
              </Button>
              <Button type="button" onClick={() => setConfirming(true)} disabled={chosen.length === 0} className="py-2.5">
                Review and import
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
    {confirming && (
      <ImportConfirmDialog plan={chosen} mode={mode} onConfirm={handleConfirm} onCancel={() => setConfirming(false)} />
    )}
    </>
  );
}
