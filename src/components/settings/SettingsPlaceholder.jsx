import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import SettingsIcon from './SettingsIcon.jsx';

/** Friendly "Coming soon" card for Settings sections that aren't built yet. */
export default function SettingsPlaceholder({ section }) {
  return (
    <Card className="text-center">
      <div className="mx-auto flex max-w-md flex-col items-center py-8 sm:py-12">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-200 text-lilac-500 shadow-sm">
          <SettingsIcon name={section.icon} className="h-9 w-9" />
        </span>

        <span className="mt-5 rounded-full bg-lilac-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-lilac-500">
          Coming soon
        </span>

        <h2 className="mt-3 text-2xl font-semibold">{section.label}</h2>
        <p className="mt-2 leading-relaxed text-ink-600">{section.description}</p>
        <p className="mt-1 leading-relaxed text-ink-500">
          We're still growing this part of MoodBloom. Check back soon 🌱
        </p>

        <Button to="/settings/profile" variant="secondary" className="mt-7 py-2.5">
          Back to My Profile
        </Button>
      </div>
    </Card>
  );
}
