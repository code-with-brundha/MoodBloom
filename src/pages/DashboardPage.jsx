import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import MoodSelector from '../components/dashboard/MoodSelector.jsx';
import QuickJournal from '../components/dashboard/QuickJournal.jsx';
import RecentEntries from '../components/dashboard/RecentEntries.jsx';
import DailyPrompt from '../components/dashboard/DailyPrompt.jsx';
import MoodSummary from '../components/dashboard/MoodSummary.jsx';
import { moods, prompts } from '../data/sampleData.js';
import { usePreferences } from '../utils/preferences.js';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';
import { toDateInputValue } from '../utils/dates.js';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider.jsx';
import { isWorldId } from '../theme/themes.js';


function getGreeting(date) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getTodaysPrompt(date) {
  const dayNumber = Math.floor(date.getTime() / 86_400_000);
  return prompts[dayNumber % prompts.length];
}

function toEntry(row) {
  return {
    id: row.id,
    date: row.entry_date,
    mood: row.mood,
    title: row.title,
    text: row.content,
  };
}

export default function DashboardPage() {
  const today = new Date();
  const todayKey = toDateInputValue(today);
  const prefs = usePreferences();
  const { user } = useAuth();
  const { appearance, selectTheme, selectVariant } = useTheme();

const isDark =
  appearance.theme === 'dark' ||
  (isWorldId(appearance.theme) && appearance.variant === 'night');

const toggleAppearance = () => {
  if (isWorldId(appearance.theme)) {
    selectVariant(appearance.theme, isDark ? 'day' : 'night');
  } else {
    selectTheme(isDark ? 'light' : 'dark');
  }
};
  const showSide = prefs.showDailyPrompt || prefs.showMoodSummary;
  const [selectedMood, setSelectedMood] = useState(null);
  const [draft, setDraft] = useState('');
  const [entries, setEntries] = useState([]);
  const [weekMoods, setWeekMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const todayLabel = today.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
  

const [profileName, setProfileName] = useState('');

useEffect(() => {
  const loadProfileName = () => {
    try {
      const profile = JSON.parse(
        localStorage.getItem('moodbloom.profile.v1') || '{}'
      );

      setProfileName(profile.fullName?.trim() || '');
    } catch {
      setProfileName('');
    }
  };

  loadProfileName();

  window.addEventListener('moodbloom:profile-updated', loadProfileName);
  window.addEventListener('focus', loadProfileName);

  return () => {
    window.removeEventListener('moodbloom:profile-updated', loadProfileName);
    window.removeEventListener('focus', loadProfileName);
  };
}, []);

const displayName =
  profileName ||
  user?.user_metadata?.name?.trim() ||
  user?.user_metadata?.display_name?.trim() ||
  user?.user_metadata?.full_name?.trim() ||
  user?.email?.split('@')[0] ||
  'Friend';


  const loadDashboard = useCallback(async () => {
    if (!user?.id) {
      setEntries([]);
      setWeekMoods([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const since = new Date();
    since.setDate(since.getDate() - 6);
    const sinceKey = toDateInputValue(since);
    const [entryResult, moodResult] = await Promise.all([
      supabase.from('journal_entries')
        .select('id, user_id, title, entry_date, mood, content, created_at')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('mood_logs')
        .select('id, user_id, log_date, mood, note, created_at')
        .eq('user_id', user.id)
        .gte('log_date', sinceKey)
        .lte('log_date', todayKey)
        .order('log_date', { ascending: true })
        .order('created_at', { ascending: true }),
    ]);
    if (entryResult.error || moodResult.error) {
      setError(`Couldn't load your dashboard data. ${(entryResult.error || moodResult.error).message}`);
      setLoading(false);
      return;
    }
    setEntries((entryResult.data ?? []).map(toEntry));
    const byDate = new Map();
    for (const row of moodResult.data ?? []) byDate.set(row.log_date, row.mood);
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toDateInputValue(d);
      days.push({
        day: d.toLocaleDateString(undefined, { weekday: 'short' }),
        mood: byDate.get(key) ?? null,
      });
    }
    setWeekMoods(days);
    setLoading(false);
  }, [user?.id, todayKey]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleSelectMood = async (mood) => {
    setSelectedMood(mood);
    if (!user?.id) return;
    setError('');
    const { error: saveError } = await supabase.from('mood_logs').insert({
      user_id: user.id, log_date: todayKey, mood, note: '',
    });
    if (saveError) {
      setError(`Couldn't save today's mood. ${saveError.message}`);
      return;
    }
    await loadDashboard();
  };

  const handleSave = async () => {
    if (!user?.id || !draft.trim()) return;
    setSaving(true);
    setError('');
    const { error: saveError } = await supabase.from('journal_entries').insert({
      user_id: user.id,
      title: 'Quick note',
      entry_date: todayKey,
      mood: selectedMood || 'calm',
      content: draft.trim(),
    });
    if (saveError) {
      setError(`Couldn't save your journal note. ${saveError.message}`);
      setSaving(false);
      return;
    }
    setDraft('');
    await loadDashboard();
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-rise">
        
<header>
  <p className="text-sm font-bold text-lilac-500">
    {todayLabel}
  </p>

  <div className="mt-1 flex items-center justify-between gap-3">
    <h1 className="text-2xl font-semibold sm:text-4xl">
      {getGreeting(today)}, {displayName} 🌸
    </h1>

    <button
      type="button"
      onClick={toggleAppearance}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-lilac-200 bg-white/70 text-ink-700 shadow-sm transition hover:bg-lilac-100 focus:outline-none focus:ring-2 focus:ring-lilac-400"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  </div>

  <p className="mt-2 text-ink-600">
    Take a breath. This is your little world.
  </p>
</header>


        {error && <p role="alert" className="mt-4 rounded-2xl border border-blush-300 bg-blush-100 px-4 py-3 text-sm">{error}</p>}
        {loading && <p role="status" className="mt-4 text-sm text-ink-500">Loading your dashboard…</p>}
        {saving && <p role="status" className="mt-2 text-sm text-ink-500">Saving your note…</p>}

        <div className={`mt-8 grid gap-6 ${showSide ? 'xl:grid-cols-3' : ''}`}>
          <div className={`space-y-6 ${showSide ? 'xl:col-span-2' : ''}`}>
            <MoodSelector moods={moods} selected={selectedMood} onSelect={handleSelectMood} />
            <QuickJournal value={draft} onChange={setDraft} onSave={handleSave} />
            <RecentEntries entries={entries} moods={moods} />
          </div>
          {showSide && (
            <div className={`grid content-start gap-6 xl:grid-cols-1 ${prefs.showDailyPrompt && prefs.showMoodSummary ? 'md:grid-cols-2' : ''}`}>
              {prefs.showDailyPrompt && <DailyPrompt prompt={getTodaysPrompt(today)} onUse={() => setDraft(getTodaysPrompt(today) + '\n\n')} />}
              {prefs.showMoodSummary && <MoodSummary week={weekMoods} moods={moods} />}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
