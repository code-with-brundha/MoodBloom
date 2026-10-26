import { useEffect, useState } from 'react';
import { loadReminders } from '../../utils/reminders.js';
import { useAuth } from '../../auth/useAuth.js';
import { loadCloudSetting, saveCloudSetting } from '../../utils/cloudSettings.js';
import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import PreferenceRow from './privacy/PreferenceRow.jsx';
import ToggleSwitch from './privacy/ToggleSwitch.jsx';
import ChoiceGroup from './privacy/ChoiceGroup.jsx';
import ResetDialog from './privacy/ResetDialog.jsx';
import {
  isDefaultPreferences,
  resetPreferences,
  updatePreferences,
  usePreferences,
} from '../../utils/preferences.js';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
];
// Shown (disabled) so people can see what is planned: the journal page has no calendar-style view yet.
const VIEW_OPTIONS = [
  { value: 'list', label: 'List' },
  { value: 'calendar', label: 'Calendar' },
];

/** Privacy & Journal Preferences: browser fallback plus per-user cloud sync when signed in. */
export default function PrivacySection() {
  const prefs = usePreferences();
  const { user } = useAuth();
  const moodReminder = loadReminders().mood; // read-only: mood reminders are managed in Settings → Reminders
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  useEffect(() => {
    let active = true;
    if (!user?.id) return () => { active = false; };
    setCloudLoading(true);
    loadCloudSetting(user.id, 'privacy_preferences').then((result) => {
      if (!active) return;
      if (result.ok && result.value && typeof result.value === 'object') { if (Object.keys(result.value).length) updatePreferences(result.value); else resetPreferences(); }
      else if (!result.ok && !result.skipped) setStatus({ type: 'error', text: 'Could not load account preferences. Check the settings migration and database policies.' });
    }).finally(() => { if (active) setCloudLoading(false); });
    return () => { active = false; };
  }, [user?.id]);

  const change = async (patch) => {
    const { ok } = updatePreferences(patch);
    if (!ok) {
      setStatus({ type: 'error', text: "We couldn't save to this browser." });
      return;
    }
    if (user?.id) {
      const result = await saveCloudSetting(user.id, 'privacy_preferences', { ...prefs, ...patch });
      setStatus(result.ok
        ? { type: 'success', text: 'Preference saved to your account.' }
        : { type: 'error', text: 'Saved in this browser, but cloud sync failed. Apply the settings migration and check database policies.' });
    } else {
      setStatus({ type: 'success', text: 'Preference saved in this browser. Sign in to sync it to your account.' });
    }
  };

  const handleReset = async () => {
    const { ok } = resetPreferences();
    setConfirmingReset(false);
    if (!ok) {
      setStatus({ type: 'error', text: "We couldn't update this browser's storage." });
      return;
    }
    if (user?.id) {
      const result = await saveCloudSetting(user.id, 'privacy_preferences', {});
      setStatus(result.ok
        ? { type: 'success', text: 'Preferences reset to defaults and synced to your account.' }
        : { type: 'error', text: 'Reset locally, but cloud sync failed. Apply the settings migration.' });
    } else setStatus({ type: 'success', text: 'Preferences reset to defaults in this browser.' });
  };

  return (
    <div className="space-y-6">
      {cloudLoading && <p role="status" className="text-sm text-ink-600">Loading your saved preferences…</p>}
      <Card className="bg-gradient-to-br from-blush-100/90 to-lilac-100/90">
        <div className="flex gap-3">
          <span aria-hidden="true" className="text-2xl">
            🔒
          </span>
          <div>
            <h2 className="text-xl font-semibold">About these settings</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              These control what MoodBloom displays; they do not encrypt or lock journal entries. When signed in, preferences sync to your account. Changing a preference never deletes or edits your entries or moods.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Privacy" subtitle="Control what is shown on screen.">
        <div className="divide-y divide-lilac-200/60">
          <PreferenceRow
            id="privacy-reminder"
            title="Journal privacy reminder"
            description="Show a gentle note on My Journal that entries can contain personal information."
          >
            <ToggleSwitch
              checked={prefs.showPrivacyReminder}
              onChange={(v) => change({ showPrivacyReminder: v })}
              labelledBy="privacy-reminder-label"
              describedBy="privacy-reminder-desc"
            />
          </PreferenceRow>

          <PreferenceRow
            id="hide-previews"
            title="Hide journal previews"
            description="Hide entry titles, text and mood notes on the dashboard, Calendar day details and Mood Insights. My Journal still shows full entries, and you can tap “Show for now” on a card to peek."
          >
            <ToggleSwitch
              checked={prefs.hidePreviews}
              onChange={(v) => change({ hidePreviews: v })}
              labelledBy="hide-previews-label"
              describedBy="hide-previews-desc"
            />
          </PreferenceRow>

          <PreferenceRow
            id="mood-summary"
            title="Mood summary on the dashboard"
            description="Show the “This week's moods” summary card on your dashboard. Mood Insights stays available from the menu."
          >
            <ToggleSwitch
              checked={prefs.showMoodSummary}
              onChange={(v) => change({ showMoodSummary: v })}
              labelledBy="mood-summary-label"
              describedBy="mood-summary-desc"
            />
          </PreferenceRow>

          <PreferenceRow
            id="confirm-delete"
            title="Confirm before deleting"
            description="Ask “Are you sure?” before a journal entry or mood record is deleted."
            note={
              prefs.confirmDelete
                ? undefined
                : 'Heads up: with this off, entries and moods are deleted straight away and can’t be undone.'
            }
          >
            <ToggleSwitch
              checked={prefs.confirmDelete}
              onChange={(v) => change({ confirmDelete: v })}
              labelledBy="confirm-delete-label"
              describedBy="confirm-delete-desc"
            />
          </PreferenceRow>
        </div>
      </Card>

      <Card title="Journal preferences" subtitle="Shape how writing and reading feel.">
        <div className="divide-y divide-lilac-200/60">
          <PreferenceRow
            id="journal-view"
            title="Default journal view"
            description="Choose whether My Journal opens as a list or a calendar-style view."
            unavailable="My Journal only has a list view for now. You can already see your entries by date on the Calendar page."
          >
            <ChoiceGroup
              name="journal-view"
              label="Default journal view"
              options={VIEW_OPTIONS}
              value="list"
              onChange={() => {}}
              disabled
              describedBy="journal-view-desc"
            />
          </PreferenceRow>

          <PreferenceRow
            id="writing-prompt"
            title="Daily writing prompt"
            description="Show the optional writing prompt on your dashboard to help you start."
          >
            <ToggleSwitch
              checked={prefs.showDailyPrompt}
              onChange={(v) => change({ showDailyPrompt: v })}
              labelledBy="writing-prompt-label"
              describedBy="writing-prompt-desc"
            />
          </PreferenceRow>

          <PreferenceRow
            id="mood-reminders"
            title="Mood-tracking reminders"
            description={`Gentle nudges to check in with your mood are set up in Settings → Reminders, so there's one place to manage them. Currently: ${
              moodReminder.enabled ? `on · ${describeSchedule('mood', moodReminder)}` : 'off'
            }. Notifications aren't live yet; your choice is only saved.`}
          >
            <Button to="/settings/reminders" variant="secondary" className="py-2.5">
              Manage in Reminders
            </Button>
          </PreferenceRow>

          <PreferenceRow
            id="journal-sort"
            title="Journal sorting"
            description="Choose the order of entries on My Journal. The dashboard's “Recent entries” always shows your latest first."
          >
            <ChoiceGroup
              name="journal-sort"
              label="Journal sorting"
              options={SORT_OPTIONS}
              value={prefs.journalSort}
              onChange={(v) => change({ journalSort: v })}
              describedBy="journal-sort-desc"
            />
          </PreferenceRow>
        </div>
      </Card>

      {/* Status + reset bar: stays in view at the bottom while scrolling */}
      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-3xl border border-white/80 bg-cream-50/95 p-3 shadow-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <p
          role="status"
          aria-live="polite"
          className={`flex min-h-[1.5rem] items-center gap-2 px-1 text-sm font-semibold ${
            status?.type === 'error' ? 'text-blush-500' : status ? 'text-lilac-500' : 'text-ink-500'
          }`}
        >
          {status ? (
            <>
              <SettingsIcon name={status.type === 'error' ? 'alert' : 'check'} className="h-5 w-5 shrink-0" />
              <span>{status.text}</span>
            </>
          ) : (
            user?.id ? 'Preferences sync to your account.' : 'Changes are saved in this browser. Sign in to sync across devices.'
          )}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setConfirmingReset(true)}
          disabled={isDefaultPreferences(prefs)}
          className="py-2.5"
        >
          Reset to defaults
        </Button>
      </div>

      {confirmingReset && <ResetDialog onConfirm={handleReset} onCancel={() => setConfirmingReset(false)} />}
    </div>
  );
}
