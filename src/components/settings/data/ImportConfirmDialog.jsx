import Modal from '../../journal/Modal.jsx';
import Button from '../../Button.jsx';

/** Last check before an import changes anything. */
export default function ImportConfirmDialog({ plan, mode, onConfirm, onCancel }) {
  const replacing = plan.filter((p) => p.replaces > 0);

  return (
    <Modal title="Import this data?" onClose={onCancel}>
      <ul className="space-y-1.5" data-testid="import-confirm-list">
        {plan.map((p) => (
          <li key={p.key} className="rounded-xl bg-lilac-100/70 px-3 py-2 text-sm text-ink-800">
            <strong>{p.label}</strong> · {p.line}
          </li>
        ))}
      </ul>

      {replacing.length > 0 ? (
        <p className="mt-4 rounded-2xl border border-lilac-300 bg-white/70 px-4 py-3 text-sm leading-relaxed text-ink-800">
          <strong>This will replace data you have now:</strong> {replacing.map((p) => p.label).join(', ')}. This can’t
          be undone. If you’re not sure, cancel and use “Export my data” first to keep a copy.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-ink-600">
          {mode === 'merge'
            ? 'Nothing you already have will be removed or changed. Items that are already here are skipped.'
            : 'Nothing you already have will be replaced.'}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className="py-2.5">
          Import data
        </Button>
      </div>
    </Modal>
  );
}
