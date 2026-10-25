import Modal from '../../journal/Modal.jsx';
import Button from '../../Button.jsx';
import { CATEGORIES, EXPORT_FILENAME } from '../../../utils/dataManagement.js';

/** Explains what the export file may contain before anything is downloaded. */
export default function ExportDialog({ overview, onConfirm, onCancel }) {
  const included = CATEGORIES.filter((c) => overview[c.key].stored);
  const hasProfile = overview.profile.stored;

  return (
    <Modal title="Export your data?" onClose={onCancel}>
      <p className="leading-relaxed text-ink-600">
        This downloads a file called <strong className="text-ink-800">{EXPORT_FILENAME}</strong> with the data saved in
        this browser:
      </p>
      <ul className="mt-3 space-y-1.5" data-testid="export-included">
        {included.map((c) => (
          <li key={c.key} className="rounded-xl bg-lilac-100/70 px-3 py-2 text-sm text-ink-800">
            <strong>{c.label}</strong> · {overview[c.key].text}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">
        Not included: journal entries, mood records and daily to-do tasks (they aren’t saved in this browser yet), and
        anything from the cloud (MoodBloom has no cloud storage yet). MoodBloom doesn’t store passwords, so none are in
        the file.
      </p>

      <div className="mt-4 rounded-2xl border border-lilac-300 bg-white/70 px-4 py-3 text-sm leading-relaxed text-ink-800">
        <strong>Please keep this file safe.</strong> It may contain personal information
        {hasProfile ? ' (your name, email, bio, date of birth, location and profile photo)' : ''} along with your
        goals, plans and dreams. The file is <strong>not encrypted or password-protected</strong>, so store it
        somewhere private and don’t share it with people you don’t trust.
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className="py-2.5">
          Download file
        </Button>
      </div>
    </Modal>
  );
}
