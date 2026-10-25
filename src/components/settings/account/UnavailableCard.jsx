import Card from '../../dashboard/Card.jsx';
import SettingsIcon from '../SettingsIcon.jsx';

/**
 * A security feature that does not exist yet. It has NO working controls on purpose:
 * it only explains what the feature will do and why it is not available in demo mode.
 */
export default function UnavailableCard({ id, icon, title, status = 'Not available yet', children, footer }) {
  return (
    <Card>
      <div className="flex items-start gap-3 sm:gap-4">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lilac-200 text-ink-800"
        >
          <SettingsIcon name={icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 id={`${id}-title`} className="text-xl font-semibold">
              {title}
            </h2>
            <span
              data-testid={`${id}-status`}
              className="rounded-full border border-lilac-200 bg-white/80 px-3 py-1 text-xs font-bold text-ink-800"
            >
              {status}
            </span>
          </div>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-600">{children}</div>
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>
    </Card>
  );
}
