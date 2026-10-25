import { useEffect, useState } from 'react';
import Button from '../Button.jsx';
import FormField from '../FormField.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import ReminderCard from './reminders/ReminderCard.jsx';
import DayPicker from './reminders/DayPicker.jsx';
import SelectField from './reminders/SelectField.jsx';
import NotificationNotice from './reminders/NotificationNotice.jsx';
import ResetRemindersDialog from './reminders/ResetRemindersDialog.jsx';
import { toDateInputValue } from '../../utils/dates.js';
import { daysBetween, loadGoals } from '../../utils/goals.js';
import { loadEvents } from '../../utils/planner.js';
import {
  GOAL_LEAD_OPTIONS,
  PLANNER_LEAD_OPTIONS,
  REMINDER_TYPES,
  clearReminders,
  countEnabled,
  defaultReminders,
  describeSchedule,
  isSameReminder,
  isSameReminders,
  loadReminders,
  sanitizeReminders,
  saveReminders,
  validateReminders,
} from '../../utils/reminders.js';

const SAVED_MESSAGE = 'Reminder preferences saved. Notifications will be available in a future update.';

const statusText = (type, r) => (r.enabled ? `On · ${describeSchedule(type, r)}` : 'Off · your settings are kept');

const plural = (n, one, many) => (n === 1 ? one : many);

/** Read-only summary of the Goal Planner's real data (nothing is created or changed). */
function goalSummary(goals, leadDays, today) {
  const dated = goals.filter((g) => g.status === 'active' && g.targetDate);
  if (dated.length === 0) return 'No active goals with a target date yet.';
  const lead = Number(leadDays);
  const soon = dated.filter((g) => {
    const days = daysBetween(today, g.targetDate);
    return days >= 0 && days <= lead;
  }).length;
  const when = lead === 0 ? 'today' : `within ${lead} ${plural(lead, 'day', 'days')}`;
  return `You have ${dated.length} active ${plural(dated.length, 'goal', 'goals')} with a target date; ${soon} ${plural(soon, 'is', 'are')} due ${when}.`;
}

/** Read-only summary of the Planner's real events (nothing is created or changed). */
function plannerSummary(events, today) {
  const upcoming = events.filter((e) => e.date >= today);
  if (upcoming.length === 0) return 'No upcoming events in your planner yet.';
  const withOwn = upcoming.filter((e) => e.reminder !== '').length;
  return `${upcoming.length} upcoming ${plural(upcoming.length, 'event', 'events')} in your planner; ${withOwn} ${plural(withOwn, 'has', 'have')} a reminder set on the event itself.`;
}

/** Where to put the cursor when a field has an error. */
const focusId = { time: (t) => `${t}-time`, days: (t) => `${t}-days-first`, leadDays: () => 'goals-lead', leadMinutes: () => 'planner-lead' };

export default function RemindersSection() {
  // Demo storage: reminder preferences live in this browser's localStorage only (not in the cloud).
  const [saved, setSaved] = useState(loadReminders);
  const [draft, setDraft] = useState(saved);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'info', text }
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Read-only look at related features, so the page can say what exists today.
  const today = toDateInputValue();
  const [goals] = useState(loadGoals);
  const [events] = useState(loadEvents);

  const dirty = !isSameReminders(draft, saved);
  const defaults = defaultReminders();
  const atDefaults = isSameReminders(draft, defaults) && isSameReminders(saved, defaults);

  // Warn before the tab is closed or refreshed with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const change = (type, patch) => {
    setDraft((prev) => ({ ...prev, [type]: { ...prev[type], ...patch } }));
    setErrors((prev) => {
      if (!prev[type]) return prev;
      const next = { ...prev[type] };
      Object.keys(patch).forEach((key) => delete next[key]);
      const copy = { ...prev };
      if (Object.keys(next).length) copy[type] = next;
      else delete copy[type];
      return copy;
    });
    setStatus(null);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const found = validateReminders(draft);
    setErrors(found);

    const firstType = REMINDER_TYPES.find((t) => found[t]);
    if (firstType) {
      setStatus({ type: 'error', text: 'Please fix the highlighted reminders.' });
      const field = Object.keys(found[firstType])[0];
      document.getElementById(focusId[field](firstType))?.focus();
      return;
    }

    const clean = sanitizeReminders(draft);
    if (!saveReminders(clean).ok) {
      setStatus({
        type: 'error',
        text: "We couldn't save to this browser (storage may be full or blocked), so your changes will be lost when you leave.",
      });
      return;
    }
    setSaved(clean);
    setDraft(clean);
    setStatus({ type: 'success', text: SAVED_MESSAGE });
  };

  const handleDiscard = () => {
    setDraft(saved);
    setErrors({});
    setStatus({ type: 'info', text: 'Changes discarded.' });
  };

  const handleReset = () => {
    const fresh = defaultReminders();
    const { ok } = clearReminders();
    setSaved(fresh);
    setDraft(fresh);
    setErrors({});
    setConfirmingReset(false);
    setStatus(
      ok
        ? { type: 'success', text: 'Reminders are back to their defaults.' }
        : { type: 'error', text: "Reset for now, but we couldn't update this browser's storage." },
    );
  };

  const cardProps = (type) => ({
    enabled: draft[type].enabled,
    onToggle: (v) => change(type, { enabled: v }),
    status: statusText(type, draft[type]),
    unsaved: !isSameReminder(type, draft, saved),
  });

  const timeField = (type, label) => (
    <div className="max-w-[13rem] [&_p[role=alert]]:text-ink-800">
      <FormField
        id={`${type}-time`}
        label={label}
        type="time"
        value={draft[type].time}
        onChange={(e) => change(type, { time: e.target.value })}
        error={errors[type]?.time}
      />
    </div>
  );

  const statusStyle = { success: 'text-ink-800', info: 'text-ink-700', error: 'text-blush-500' };

  return (
    <form onSubmit={handleSave} noValidate className="space-y-6">
      <NotificationNotice enabledCount={countEnabled(saved)} total={REMINDER_TYPES.length} />

      <ReminderCard
        id="journal"
        icon="journal"
        title="Daily Journal Reminder"
        description="A gentle nudge to write a few words about your day."
        note="Saved as a preference only. My Journal doesn't send reminders yet."
        {...cardProps('journal')}
      >
        {timeField('journal', 'Reminder time')}
        <DayPicker
          id="journal-days"
          value={draft.journal.days}
          onChange={(days) => change('journal', { days })}
          error={errors.journal?.days}
        />
      </ReminderCard>

      <ReminderCard
        id="mood"
        icon="mood"
        title="Mood Check-in Reminder"
        description="A quick reminder to notice and log how you're feeling."
        note="Saved as a preference only. The Mood Tracker doesn't send reminders yet. This is the one place to manage mood reminders; Privacy & Journal Preferences links here."
        {...cardProps('mood')}
      >
        {timeField('mood', 'Reminder time')}
        <DayPicker
          id="mood-days"
          value={draft.mood.days}
          onChange={(days) => change('mood', { days })}
          error={errors.mood?.days}
        />
      </ReminderCard>

      <ReminderCard
        id="todo"
        icon="todo"
        title="Daily To-Do Reminder"
        description="A daily moment to look over what's still pending."
        note="Your tasks aren't kept between visits yet, so MoodBloom can't count pending tasks here. Your time is saved for when that's ready."
        {...cardProps('todo')}
      >
        {timeField('todo', 'Time to review pending tasks')}
      </ReminderCard>

      <ReminderCard
        id="goals"
        icon="goals"
        title="Goal Deadline Reminder"
        description="A heads-up before one of your goals reaches its target date."
        note="Saved as a preference only. The Goal Planner shows deadline labels but doesn't send reminders yet."
        {...cardProps('goals')}
      >
        <SelectField
          id="goals-lead"
          label="Remind me"
          value={draft.goals.leadDays}
          onChange={(v) => change('goals', { leadDays: v })}
          options={GOAL_LEAD_OPTIONS}
          error={errors.goals?.leadDays}
        />
        <p data-testid="goals-summary" className="text-sm leading-relaxed text-ink-600">
          {goalSummary(goals, draft.goals.leadDays, today)}
        </p>
      </ReminderCard>

      <ReminderCard
        id="planner"
        icon="planner"
        title="Planner Event Reminder"
        description="A reminder ahead of the events in your Weekly & Monthly Planner."
        note="Saved as a preference only. Each event keeps its own reminder, chosen when you add or edit it in the Planner; this is your default interval for future use."
        {...cardProps('planner')}
      >
        <SelectField
          id="planner-lead"
          label="Default reminder interval"
          value={draft.planner.leadMinutes}
          onChange={(v) => change('planner', { leadMinutes: v })}
          options={PLANNER_LEAD_OPTIONS}
          error={errors.planner?.leadMinutes}
        />
        <p data-testid="planner-summary" className="text-sm leading-relaxed text-ink-600">
          {plannerSummary(events, today)}
        </p>
      </ReminderCard>

      {/* Save / discard / reset bar: stays in view at the bottom while scrolling */}
      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-3xl border border-white/80 bg-cream-50/95 p-3 shadow-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <p
          role="status"
          aria-live="polite"
          data-testid="save-status"
          className={`flex min-h-[1.5rem] items-center gap-2 px-1 text-sm font-semibold ${
            status ? statusStyle[status.type] : 'text-ink-700'
          }`}
        >
          {status ? (
            <>
              <SettingsIcon name={status.type === 'error' ? 'alert' : 'check'} className="h-5 w-5 shrink-0" />
              <span>{status.text}</span>
            </>
          ) : dirty ? (
            'You have unsaved changes.'
          ) : (
            ''
          )}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={!dirty} className="order-first py-2.5 sm:order-last">
            Save changes
          </Button>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <Button type="button" variant="ghost" onClick={handleDiscard} disabled={!dirty} className="py-2.5">
              Discard changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmingReset(true)}
              disabled={atDefaults}
              className="py-2.5"
            >
              Reset to defaults
            </Button>
          </div>
        </div>
      </div>

      {confirmingReset && <ResetRemindersDialog onConfirm={handleReset} onCancel={() => setConfirmingReset(false)} />}
    </form>
  );
}
