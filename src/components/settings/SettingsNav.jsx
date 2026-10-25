import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SettingsIcon from './SettingsIcon.jsx';
import { settingsSections } from '../../data/settingsSections.js';

/**
 * Settings section menu (separate from the main sidebar).
 * Phones/tablets/laptops: a row of pills you can swipe sideways.
 * Wide desktop (xl+): a vertical list in a card.
 */
export default function SettingsNav() {
  const navRef = useRef(null);
  const { pathname } = useLocation();

  // Keep the active pill visible when the row is scrolled sideways.
  useEffect(() => {
    navRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      aria-label="Settings sections"
      className="min-w-0 xl:sticky xl:top-8 xl:self-start xl:rounded-3xl xl:border xl:border-white/80 xl:bg-white/70 xl:p-3 xl:shadow-soft xl:backdrop-blur-md"
    >
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 xl:mx-0 xl:flex-col xl:gap-1 xl:overflow-visible xl:px-0 xl:pb-0">
        {settingsSections.map((section) => (
          <li key={section.key} className="shrink-0 xl:shrink">
            <NavLink
              to={section.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition xl:whitespace-normal xl:rounded-2xl xl:py-3 xl:text-base ${
                  isActive
                    ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm'
                    : 'bg-white/70 text-ink-600 hover:bg-lilac-100 xl:bg-transparent'
                }`
              }
            >
              <SettingsIcon name={section.icon} className="h-5 w-5 shrink-0" />
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
