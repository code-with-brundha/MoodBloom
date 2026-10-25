import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Card from '../components/dashboard/Card.jsx';
import Modal from '../components/journal/Modal.jsx';
import EntryForm from '../components/journal/EntryForm.jsx';
import MoodLogForm from '../components/mood/MoodLogForm.jsx';
import CalendarHeader from '../components/calendar/CalendarHeader.jsx';
import CalendarGrid from '../components/calendar/CalendarGrid.jsx';
import DayDetails from '../components/calendar/DayDetails.jsx';
import { moods } from '../data/sampleData.js';
import { firstOfMonth, groupByDate, monthLabel } from '../utils/calendar.js';
import { formatEntryDate, toDateInputValue } from '../utils/dates.js';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';

const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));

function mapMood(row) {
  return { id: row.id, date: row.log_date, mood: row.mood, note: row.note ?? '' };
}
function mapEntry(row) {
  return { id: row.id, date: row.entry_date, mood: row.mood, title: row.title, text: row.content };
}

export default function CalendarPage() {
  const todayKey = toDateInputValue();
  const { user } = useAuth();
  const [viewDate, setViewDate] = useState(() => firstOfMonth());
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [moodLogs, setMoodLogs] = useState([]);
  const [entries, setEntries] = useState([]);
  const [adding, setAdding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detailsRef = useRef(null);

  const moodsByDate = useMemo(() => groupByDate(moodLogs), [moodLogs]);
  const entriesByDate = useMemo(() => groupByDate(entries), [entries]);

  const loadCalendar = useCallback(async () => {
    if (!user?.id) {
      setMoodLogs([]);
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const [moodResult, entryResult] = await Promise.all([
      supabase.from('mood_logs')
        .select('id, user_id, log_date, mood, note, created_at')
        .eq('user_id', user.id)
        .order('log_date', { ascending: true }),
      supabase.from('journal_entries')
        .select('id, user_id, title, entry_date, mood, content, created_at')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: true }),
    ]);
    if (moodResult.error || entryResult.error) {
      setError(`Couldn't load calendar data. ${(moodResult.error || entryResult.error).message}`);
      setLoading(false);
      return;
    }
    setMoodLogs((moodResult.data ?? []).map(mapMood));
    setEntries((entryResult.data ?? []).map(mapEntry));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadCalendar(); }, [loadCalendar]);

  const goToMonth = (offset) => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + offset, 1));
  const goToToday = () => { setViewDate(firstOfMonth()); setSelectedKey(todayKey); };

  const handleSelect = (key) => {
    setSelectedKey(key);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveMood = async (values) => {
    if (!user?.id) { setError('Please sign in to save a mood.'); return; }
    setSaving(true);
    setError('');
    const { data, error: saveError } = await supabase.from('mood_logs').insert({
      user_id: user.id, log_date: values.date, mood: values.mood, note: values.note ?? '',
    }).select('id, user_id, log_date, mood, note, created_at').single();
    if (saveError) { setError(`Couldn't save this mood. ${saveError.message}`); setSaving(false); return; }
    setMoodLogs((prev) => [...prev, mapMood(data)]);
    setSelectedKey(values.date);
    setViewDate(new Date(`${values.date}T00:00:00`));
    setAdding(null);
    setSaving(false);
  };

  const handleSaveEntry = async (values) => {
    if (!user?.id) { setError('Please sign in to save a journal entry.'); return; }
    setSaving(true);
    setError('');
    const { data, error: saveError } = await supabase.from('journal_entries').insert({
      user_id: user.id, title: values.title, entry_date: values.date, mood: values.mood, content: values.text,
    }).select('id, user_id, title, entry_date, mood, content, created_at').single();
    if (saveError) { setError(`Couldn't save this journal entry. ${saveError.message}`); setSaving(false); return; }
    setEntries((prev) => [...prev, mapEntry(data)]);
    setSelectedKey(values.date);
    setViewDate(new Date(`${values.date}T00:00:00`));
    setAdding(null);
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header>
          <h1 className="text-3xl font-semibold sm:text-4xl">Calendar 🗓️</h1>
          <p className="mt-2 text-ink-600">See your moods and stories laid out day by day.</p>
        </header>
        {error && <p role="alert" className="mt-4 rounded-2xl border border-blush-300 bg-blush-100 px-4 py-3 text-sm">{error}</p>}
        {loading && <p role="status" className="mt-4 text-sm text-ink-500">Loading your calendar…</p>}

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CalendarHeader label={monthLabel(viewDate)} onPrev={() => goToMonth(-1)} onNext={() => goToMonth(1)} onToday={goToToday} />
            <div className="mt-5">
              <CalendarGrid viewDate={viewDate} selectedKey={selectedKey} todayKey={todayKey}
                moodsByDate={moodsByDate} entriesByDate={entriesByDate} moodByKey={moodByKey} onSelect={handleSelect} />
            </div>
          </Card>
          <div ref={detailsRef} className="scroll-mt-20 lg:col-span-2">
            <DayDetails dateKey={selectedKey} todayKey={todayKey}
              moodLogs={moodsByDate[selectedKey] ?? []} entries={entriesByDate[selectedKey] ?? []}
              moodByKey={moodByKey} onAddMood={() => setAdding('mood')} onAddJournal={() => setAdding('journal')} />
          </div>
        </div>
      </div>

      {adding === 'mood' && (
        <Modal title={`Add mood · ${formatEntryDate(selectedKey)}`} onClose={() => !saving && setAdding(null)}>
          <MoodLogForm record={{ date: selectedKey, mood: null, note: '' }} moods={moods}
            submitLabel={saving ? 'Saving…' : 'Log mood'} onSave={handleSaveMood} onCancel={() => setAdding(null)} />
        </Modal>
      )}
      {adding === 'journal' && (
        <Modal title={`Add journal · ${formatEntryDate(selectedKey)}`} onClose={() => !saving && setAdding(null)}>
          <EntryForm entry={{ date: selectedKey }} submitLabel={saving ? 'Saving…' : 'Save entry'} moods={moods}
            onSave={handleSaveEntry} onCancel={() => setAdding(null)} />
        </Modal>
      )}
    </DashboardLayout>
  );
}
