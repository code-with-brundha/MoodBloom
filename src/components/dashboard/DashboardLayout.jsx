
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import Logo from '../Logo.jsx';
import SoftBackground from '../SoftBackground.jsx';
import Sidebar from './Sidebar.jsx';
import Icon from './Icon.jsx';

import { AuthLoadingScreen } from '../../auth/AuthProvider.jsx';
import { useAuth } from '../../auth/useAuth.js';

import { useTheme } from '../../theme/ThemeProvider.jsx';
import { isWorldId } from '../../theme/themes.js';
import ThemeBackdrop from '../../theme/ThemeBackdrop.jsx';

/**
 * Every signed-in page uses this component, so the sign-in check lives here:
 * - While the saved session is being checked, show a loading screen.
 * - If no session exists, redirect to /signin.
 */
export default function DashboardLayout({ children }) {
  const { session, loading, manualSignOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthLoadingScreen />;
  }

  if (!session) {
    const from = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate
        to="/signin"
        replace
        state={manualSignOut ? undefined : { from }}
      />
    );
  }

  return <LayoutShell>{children}</LayoutShell>;
}

/**
 * Page shell for the signed-in area.
 * Desktop: fixed sidebar on the left.
 * Mobile/tablet: top bar with a drawer menu.
 */
function LayoutShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { key } = useTheme();

  // Close the mobile drawer when Escape is pressed.
  useEffect(() => {
    if (!menuOpen) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const mode =
    key.endsWith('-night') || key === 'dark' ? 'dark' : 'light';

  const world = isWorldId(key)
    ? key.replace(/-(day|night)$/, '')
    : '';

  return (
    <div
  data-theme={key}
  data-mode={key.endsWith('-night') || key === 'dark' ? 'dark' : 'light'}
  data-world={isWorldId(key) ? key.replace(/-(day|night)$/, '') : ''}
  className="relative min-h-screen"
>
  <ThemeBackdrop themeKey={key} />
      <SoftBackground />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/80 bg-white/60 p-5 backdrop-blur-md lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/80 bg-cream-100/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <Logo />

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-full p-2 text-ink-700 hover:bg-lilac-100"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-scrim/30 backdrop-blur-sm"
          />

          <div className="relative h-full w-72 max-w-[85%] bg-cream-100 p-5 shadow-soft">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-full p-2 text-ink-600 hover:bg-lilac-100"
            >
              <Icon name="close" />
            </button>

            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Dashboard content */}
      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
