import Modal from './Modal.jsx';
import Button from '../Button.jsx';

/** "Are you sure?" dialog used before deleting an entry. */
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="leading-relaxed text-ink-600">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Keep it
        </Button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center justify-center rounded-full bg-blush-500 px-7 py-2.5 text-base font-bold text-white shadow-petal transition hover:-translate-y-0.5 hover:bg-blush-400 active:scale-[0.98]"
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
