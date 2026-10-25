import Card from '../../dashboard/Card.jsx';
import SettingsIcon from '../SettingsIcon.jsx';

/** Top-of-page honesty note: preferences are saved, but nothing is sent yet. */
export default function NotificationNotice({ enabledCount, total }) {
  return (
    <Card className="bg-gradient-to-br from-blush-100/90 to-lilac-100/90">
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-ink-800"
        >
          <SettingsIcon name="reminders" className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">Your reminder preferences</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-700">
            Your reminder preferences are saved. Notifications will be available in a future update. Until then,
            MoodBloom won’t send alerts or ask for notification permission, and your choices are kept in this browser
            only (demo).
          </p>
          <p
            data-testid="enabled-count"
            className="mt-3 inline-block rounded-full bg-white/70 px-3 py-1 text-sm font-bold text-ink-800"
          >
            {enabledCount} of {total} reminders turned on
          </p>
        </div>
      </div>
    </Card>
  );
}
