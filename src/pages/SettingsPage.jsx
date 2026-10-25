import { Navigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import SettingsNav from '../components/settings/SettingsNav.jsx';
import ProfileSection from '../components/settings/ProfileSection.jsx';
import AppearanceSection from '../components/settings/AppearanceSection.jsx';
import PrivacySection from '../components/settings/PrivacySection.jsx';
import RemindersSection from '../components/settings/RemindersSection.jsx';
import AccountSection from '../components/settings/AccountSection.jsx';
import DataManagementSection from '../components/settings/DataManagementSection.jsx';
import SettingsPlaceholder from '../components/settings/SettingsPlaceholder.jsx';
import { settingsSections } from '../data/settingsSections.js';

/**
 * Settings shell: section menu + the selected section.
 * URLs: /settings/profile, /settings/appearance, /settings/privacy,
 *       /settings/reminders, /settings/account, /settings/data
 */
export default function SettingsPage() {
  const { section } = useParams();
  const current = settingsSections.find((s) => s.key === section);

  // Unknown section in the URL: go to the default one.
  if (!current) return <Navigate to="/settings/profile" replace />;

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header>
          <h1 className="text-3xl font-semibold sm:text-4xl">Settings ⚙️</h1>
          <p className="mt-2 text-ink-600">Make MoodBloom feel like yours.</p>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
          <SettingsNav />

          <div className="min-w-0">
            {current.key === 'profile' && <ProfileSection />}
            {current.key === 'appearance' && <AppearanceSection />}
            {current.key === 'privacy' && <PrivacySection />}
            {current.key === 'reminders' && <RemindersSection />}
            {current.key === 'account' && <AccountSection />}
            {current.key === 'data' && <DataManagementSection />}
            {!['profile', 'appearance', 'privacy', 'reminders', 'account', 'data'].includes(current.key) && <SettingsPlaceholder section={current} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
