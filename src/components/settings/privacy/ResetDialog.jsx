import Modal from '../../journal/Modal.jsx';
import Button from '../../Button.jsx';

/** "Reset to defaults?" confirmation. */
export default function ResetDialog({ onConfirm, onCancel }) {
  return (
    <Modal title="Reset to defaults?" onClose={onCancel}>
      <p className="leading-relaxed text-ink-600">
        This puts every privacy and journal preference back to its original setting. Your journal entries, moods
        and everything else stay exactly as they are.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className="py-2.5">
          Reset preferences
        </Button>
      </div>
    </Modal>
  );
}
