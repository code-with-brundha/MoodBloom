import Modal from '../../journal/Modal.jsx';
import Button from '../../Button.jsx';

/** Spells out exactly what will be deleted before anything is cleared. */
export default function ClearDialog({ items, onConfirm, onCancel }) {
  return (
    <Modal title="Clear selected data?" onClose={onCancel}>
      <p className="leading-relaxed text-ink-600">This will permanently remove the following from this browser:</p>
      <ul className="mt-3 space-y-1.5" data-testid="clear-confirm-list">
        {items.map((i) => (
          <li key={i.key} className="rounded-xl bg-lilac-100/70 px-3 py-2 text-sm text-ink-800">
            <strong>{i.label}</strong> · {i.text}
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-2xl border border-lilac-300 bg-white/70 px-4 py-3 text-sm leading-relaxed text-ink-800">
        <strong>This can’t be undone.</strong> Consider using “Export my data” first. It only clears data saved in this
        browser. It doesn’t delete any cloud records or a real account (MoodBloom has none yet), and everything you
        don’t tick stays exactly as it is.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className="py-2.5">
          Clear selected data
        </Button>
      </div>
    </Modal>
  );
}
