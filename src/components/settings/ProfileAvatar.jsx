import { getInitials } from '../../utils/profile.js';

/** Round avatar: the chosen photo, or the person's initials on a soft gradient. */
export default function ProfileAvatar({ src, name, className = 'h-24 w-24 text-3xl' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blush-200 to-lilac-300 font-display font-semibold text-ink-800 shadow-soft ${className}`}
    >
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
