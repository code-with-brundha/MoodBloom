// The six Settings sections. Only "profile" is built so far; the rest show a "Coming soon" card.
export const settingsSections = [
  {
    key: 'profile',
    path: '/settings/profile',
    label: 'My Profile',
    icon: 'profile',
    description: 'Your photo, name and a few details about you.',
  },
  {
    key: 'appearance',
    path: '/settings/appearance',
    label: 'Appearance & Themes',
    icon: 'appearance',
    description: 'Pick colors and themes that match your mood.',
  },
  {
    key: 'privacy',
    path: '/settings/privacy',
    label: 'Privacy & Journal Preferences',
    icon: 'privacy',
    description: 'Decide how private your journal is and how it behaves.',
  },
  {
    key: 'reminders',
    path: '/settings/reminders',
    label: 'Reminders',
    icon: 'reminders',
    description: 'Gentle nudges to check in with yourself.',
  },
  {
    key: 'account',
    path: '/settings/account',
    label: 'Account & Security',
    icon: 'account',
    description: 'Password, sign-in and account safety.',
  },
  {
    key: 'data',
    path: '/settings/data',
    label: 'Data Management',
    icon: 'data',
    description: 'Export, back up or clear your MoodBloom data.',
  },
];
