
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo.jsx';
import Icon from './Icon.jsx';
import { useAuth } from '../../auth/useAuth.js';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
  { label: 'My Journal', icon: 'journal', to: '/journal' },
  { label: 'Mood Tracker', icon: 'mood', to: '/mood-tracker' },
  { label: 'Calendar', icon: 'calendar', to: '/calendar' },
  { label: 'Mood Insights', icon: 'insights', to: '/mood-insights' },
  { label: 'Daily To-Do', icon: 'todo', to: '/todo' },
  { label: 'Goal Planner', icon: 'goals', to: '/goals' },
  { label: 'Weekly & Monthly', icon: 'planner', to: '/planner' },
  { label: 'Bucket List', icon: 'bucket', to: '/bucket-list' },
  { label: 'Settings', icon: 'settings', to: '/settings' },
];

const itemBase =
  'flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition';

export default function Sidebar({ onNavigate }) {
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);
    setError('');

    try {
      const result = await signOut();

      if (!result.ok) {
        setError(result.error || 'Unable to sign out. Please try again.');
        setSigningOut(false);
        return;
      }

      onNavigate?.();
      // DashboardLayout will redirect to /signin
      // after the authentication session becomes null.
    } catch {
      setError('Something went wrong while signing out. Please try again.');
      setSigningOut(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-2 pt-1">
        <Logo />
      </div>

      <nav aria-label="Main" className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `${itemBase} ${
                isActive
                  ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm'
                  : 'text-ink-600 hover:bg-lilac-100'
              }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className={`${itemBase} w-full text-left text-blush-500 hover:bg-blush-100 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <Icon name="logout" />
          {signingOut ? 'Signing Out…' : 'Sign Out'}
        </button>

        {error && (
          <p role="alert" className="px-4 py-2 text-sm text-blush-500">
            {error}
          </p>
        )}
      </nav>
    </div>
  );
}
