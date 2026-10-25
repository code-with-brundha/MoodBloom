import { useEffect } from 'react';
import JournalIcon from './JournalIcon.jsx';

/**
 * Generic dialog. Bottom sheet on phones, centered card on larger screens.
 * Closes with Escape, the X button, or a click on the dim background.
 */
export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; // stop the page scrolling behind the dialog
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-scrim/30 backdrop-blur-sm"
      />

      <div className="relative max-h-[92vh] w-full max-w-xl animate-rise overflow-y-auto rounded-t-[2rem] border border-white/80 bg-cream-50 p-5 shadow-soft sm:rounded-[2rem] sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink-600 hover:bg-lilac-100"
          >
            <JournalIcon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
