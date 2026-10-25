import Card from '../dashboard/Card.jsx';
import ProfileAvatar from './ProfileAvatar.jsx';

/** How the profile looks. Follows the form as you type, so it shows unsaved edits too. */
export default function ProfilePreviewCard({ profile, unsaved }) {
  const name = profile.fullName.trim() || 'Your name';
  const username = profile.username.trim();
  const bio = profile.bio.trim();
  const location = profile.location.trim();

  return (
    <Card
      title="Profile preview"
      subtitle="Updates as you type."
      action={
        unsaved && (
          <span className="shrink-0 rounded-full bg-blush-100 px-3 py-1 text-xs font-bold text-blush-500">
            Unsaved changes
          </span>
        )
      }
      className="bg-gradient-to-br from-blush-100/90 to-lilac-100/90"
    >
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <ProfileAvatar src={profile.avatar} name={name} className="h-24 w-24 text-3xl sm:h-28 sm:w-28" />

        <div className="min-w-0 flex-1">
          <p className="break-words font-display text-2xl font-semibold text-ink-800">{name}</p>
          <p className="break-all text-sm font-bold text-lilac-500">{username ? `@${username}` : '@username'}</p>
          <p className={`mt-2 break-words leading-relaxed ${bio ? 'text-ink-600' : 'text-ink-500/70'}`}>
            {bio || 'Your bio will appear here.'}
          </p>
          {location && (
            <p className="mt-2 inline-block rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-ink-600">
              📍 {location}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
