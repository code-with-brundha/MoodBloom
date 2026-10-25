import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Card from '../components/dashboard/Card.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import MoodLogForm from '../components/mood/MoodLogForm.jsx';
import WeeklyMoodChart from '../components/mood/WeeklyMoodChart.jsx';
import MoodHistory from '../components/mood/MoodHistory.jsx';
import { moods } from '../data/sampleData.js';
import { usePreferences } from '../utils/preferences.js';
import { useAuth } from '../auth/useAuth.js';
import { supabase } from '../lib/supabaseClient.js';

// The UI uses { id, date, mood, note }; Supabase stores { id, log_date, mood, note }.
const fromDatabase = (row) => ({
  id: row.id,
  date: row.log_date,
  mood: row.mood,
  note: row.note ?? '',
});

export default function MoodTrackerPage() {
  const { confirmDelete } = usePreferences();
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadLogs = useCallback(async () => {
    if (!user?.id) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: queryError } = await supabase
      .from('mood_logs')
      .select('id, user_id, log_date, mood, note, created_at')
      .eq('user_id', user.id)
      .order('log_date', { ascending: false })
      .order('created_at', { ascending: false });
    if (queryError) {
      setError(`Couldn't load mood history: ${queryError.message}`);
      setLogs([]);
    } else {
      setLogs((data ?? []).map(fromDatabase));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleLog = async (values) => {
    if (!user?.id) {
      setError('Please sign in to save your mood.');
      return;
    }
    setSaving(true);
    setError('');
    setNotice('');
    const { data, error: insertError } = await supabase
      .from('mood_logs')
      .insert({ user_id: user.id, log_date: values.date, mood: values.mood, note: values.note ?? '' })
      .select('id, user_id, log_date, mood, note, created_at')
      .single();
    if (insertError) {
      setError(`Couldn't save your mood: ${insertError.message}`);
    } else {
      setLogs((prev) => [fromDatabase(data), ...prev]);
      setFormKey((key) => key + 1);
      setNotice('Mood saved successfully 🌸');
    }
    setSaving(false);
  };

  const handleEditSave = async (values) => {
    if (!editing || !user?.id) return;
    setSaving(true);
    setError('');
    const { data, error: updateError } = await supabase
      .from('mood_logs')
      .update({ log_date: values.date, mood: values.mood, note: values.note ?? '' })
      .eq('id', editing.id)
      .eq('user_id', user.id)
      .select('id, user_id, log_date, mood, note, created_at')
      .single();
    if (updateError) {
      setError(`Couldn't update your mood: ${updateError.message}`);
    } else {
      setLogs((prev) => prev.map((log) => (log.id === editing.id ? fromDatabase(data) : log)));
      setEditing(null);
      setNotice('Mood updated 🌷');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleting || !user?.id) return;
    setSaving(true);
    setError('');
    const { error: deleteError } = await supabase
      .from('mood_logs')
      .delete()
      .eq('id', deleting.id)
      .eq('user_id', user.id);
    if (deleteError) {
      setError(`Couldn't delete this mood: ${deleteError.message}`);
    } else {
      setLogs((prev) => prev.filter((log) => log.id !== deleting.id));
      setDeleting(null);
      setNotice('Mood record deleted.');
    }
    setSaving(false);
  };

  const requestDelete = (record) => {
    if (confirmDelete) setDeleting(record);
    else void deleteRecord(record);
  };

  const deleteRecord = async (record) => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    const { error: deleteError } = await supabase
      .from('mood_logs')
      .delete()
      .eq('id', record.id)
      .eq('user_id', user.id);
    if (deleteError) setError(`Couldn't delete this mood: ${deleteError.message}`);
    else {
      setLogs((prev) => prev.filter((log) => log.id !== record.id));
      setNotice('Mood record deleted.');
    }
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header>
          <h1 className="text-3xl font-semibold sm:text-4xl">Mood Tracker 🌈</h1>
          <p className="mt-2 text-ink-600">Check in with yourself and watch your week take shape.</p>
        </header>

        <div className="mt-8 space-y-6">
          <Card title="Log today's mood" subtitle="It only takes a few seconds.">
            <MoodLogForm key={formKey} moods={moods} onSave={handleLog} />
            {saving && <p role="status" className="mt-3 text-sm text-ink-600">Saving…</p>}
            {notice && <p role="status" className="mt-4 rounded-2xl bg-lilac-100 px-4 py-3 text-sm font-semibold text-lilac-500">{notice}</p>}
            {error && <p role="alert" className="mt-4 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-blush-500">{error}</p>}
          </Card>

          {loading ? (
            <Card title="Mood history" subtitle="Loading your saved mood records…">
              <p className="py-6 text-center text-ink-600">Loading your moods…</p>
            </Card>
          ) : (
            <>
              <WeeklyMoodChart logs={logs} moods={moods} />
              <MoodHistory logs={logs} moods={moods} onEdit={setEditing} onDelete={requestDelete} />
            </>
          )}
        </div>
      </div>

      {editing && (
        <Modal title="Edit mood" onClose={() => setEditing(null)}>
          <MoodLogForm record={editing} moods={moods} submitLabel={saving ? 'Saving…' : 'Save changes'} onSave={handleEditSave} onCancel={() => setEditing(null)} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this mood?"
          message="This mood record will be removed from your history. This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </DashboardLayout>
  );
}
