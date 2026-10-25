import Modal from '../../journal/Modal.jsx';
import Button from '../../Button.jsx';

/** "Reset to defaults?" confirmation for the Reminders page. */
export default function ResetRemindersDialog({ onConfirm, onCancel }) {
  return (
    <Modal title="Reset reminders to defaults?" onClose={onCancel}>
      <p className="leading-relaxed text-ink-600">
        This turns every reminder off and puts all times, days and intervals back to their starting values. Any
        changes you haven’t saved here will be lost too. Your journal, moods, tasks, goals and planner events stay
        exactly as they are.
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="button" onClick={onConfirm} className="py-2.5">
          Reset reminders
        </Button>
      </div>
    </Modal>
  );
}
