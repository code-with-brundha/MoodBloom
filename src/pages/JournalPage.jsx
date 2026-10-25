import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import EntryForm from '../components/journal/EntryForm.jsx';
import EntryCard from '../components/journal/EntryCard.jsx';
import JournalFilters from '../components/journal/JournalFilters.jsx';
import JournalIcon from '../components/journal/JournalIcon.jsx';
import JournalPrivacyNote from '../components/journal/JournalPrivacyNote.jsx';
import { usePreferences } from '../utils/preferences.js';
import { moods } from '../data/sampleData.js';
import { useAuth } from '../auth/useAuth.js';
import { supabase } from '../lib/supabaseClient.js';

const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));

// Convert the database shape to the existing UI shape.
const fromDatabase = (row) => ({
  id: row.id,
  title: row.title,
  date: row.entry_date,
  mood: row.mood,
  text: row.content,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export default function JournalPage() {
  const { journalSort, showPrivacyReminder, confirmDelete } = usePreferences();
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [formState, setFormState] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState('');

  const loadEntries = useCallback(async () => {
    if (!user?.id) {
      setEntries([]);
      setLoadingEntries(false);
      return;
    }
    setLoadingEntries(true);
    setPageError('');
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, user_id, title, entry_date, mood, content, created_at, updated_at')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: journalSort === 'oldest' })
      .order('created_at', { ascending: journalSort === 'oldest' });

    if (error) {
      setPageError(`Couldn't load your journal entries. ${error.message}`);
      setEntries([]);
    } else {
      setEntries((data ?? []).map(fromDatabase));
    }
    setLoadingEntries(false);
  }, [user?.id, journalSort]);

  useEffect(() => {
    if (!authLoading) loadEntries();
  }, [authLoading, loadEntries]);

  const visibleEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries
      .filter((e) => moodFilter === 'all' || e.mood === moodFilter)
      .filter((e) => !query || `${e.title} ${e.text}`.toLowerCase().includes(query));
  }, [entries, search, moodFilter]);

  const hasFilters = search.trim() !== '' || moodFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setMoodFilter('all');
  };

  const handleSave = async (values) => {
    if (!user?.id) {
      setPageError('Please sign in again to save a journal entry.');
      return;
    }
    setSaving(true);
    setPageError('');
    const payload = {
      user_id: user.id,
      title: values.title.trim(),
      entry_date: values.date,
      mood: values.mood,
      content: values.text.trim(),
      updated_at: new Date().toISOString(),
    };

    const result = formState?.id
      ? await supabase.from('journal_entries').update(payload).eq('id', formState.id).eq('user_id', user.id).select().single()
      : await supabase.from('journal_entries').insert(payload).select().single();

    if (result.error) {
      setPageError(`Couldn't save your entry. ${result.error.message}`);
      setSaving(false);
      return;
    }
    await loadEntries();
    setSaving(false);
    setFormState(null);
  };

  const handleDelete = async () => {
    if (!entryToDelete || !user?.id) return;
    setPageError('');
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryToDelete.id)
      .eq('user_id', user.id);
    if (error) {
      setPageError(`Couldn't delete this entry. ${error.message}`);
      return;
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== entryToDelete.id));
    setEntryToDelete(null);
  };

  const requestDelete = async (entry) => {
    if (confirmDelete) setEntryToDelete(entry);
    else {
      setEntryToDelete(entry);
      // Use the same database-backed delete path when confirmation is disabled in Settings.
      if (!user?.id) return;
      setPageError('');
      const { error } = await supabase.from('journal_entries').delete().eq('id', entry.id).eq('user_id', user.id);
      if (error) setPageError(`Couldn't delete this entry. ${error.message}`);
      else setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      setEntryToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">My Journal 📖</h1>
            <p className="mt-2 text-ink-600">Every feeling and story, all in one cozy place.</p>
          </div>
          <Button type="button" onClick={() => setFormState({})} className="w-full sm:w-auto">
            <JournalIcon name="plus" /> New entry
          </Button>
        </header>

        {showPrivacyReminder && <JournalPrivacyNote />}
        {pageError && <div role="alert" className="mt-5 rounded-2xl border border-blush-300 bg-blush-50 p-4 text-sm text-blush-700">{pageError}</div>}

        <div className="mt-8">
          <JournalFilters search={search} onSearchChange={setSearch} moods={moods} moodFilter={moodFilter} onMoodChange={setMoodFilter} />
        </div>

        <p role="status" className="mt-6 text-sm font-semibold text-ink-500">
          {loadingEntries || authLoading ? 'Loading your entries…' : hasFilters ? `Showing ${visibleEntries.length} of ${entries.length} entries` : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`}
          {!loadingEntries && !authLoading && (journalSort === 'oldest' ? ' · Oldest first' : ' · Newest first')}
        </p>

        {loadingEntries || authLoading ? (
          <div className="mt-4 rounded-3xl border border-white/80 bg-white/60 px-6 py-14 text-center shadow-soft"><p className="text-ink-600">Loading your little world…</p></div>
        ) : visibleEntries.length > 0 ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {visibleEntries.map((entry) => <EntryCard key={entry.id} entry={entry} mood={moodByKey[entry.mood]} onEdit={setFormState} onDelete={requestDelete} />)}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-white/80 bg-white/60 px-6 py-14 text-center shadow-soft">
            <p className="text-4xl" aria-hidden="true">{hasFilters ? '🔍' : '🌱'}</p>
            <h2 className="mt-3 text-xl font-semibold">{hasFilters ? 'No entries match your search' : 'Your journal is waiting'}</h2>
            <p className="mx-auto mt-2 max-w-sm text-ink-600">{hasFilters ? 'Try a different word or mood, or clear the filters.' : 'Write your first entry and let your feelings bloom.'}</p>
            <div className="mt-6 flex justify-center">{hasFilters ? <Button type="button" variant="secondary" onClick={clearFilters} className="py-2.5">Clear filters</Button> : <Button type="button" onClick={() => setFormState({})} className="py-2.5"><JournalIcon name="plus" /> New entry</Button>}</div>
          </div>
        )}
      </div>

      {formState && (
        <Modal title={formState.id ? 'Edit entry' : 'New entry'} onClose={() => setFormState(null)}>
          <EntryForm entry={formState.id ? formState : null} moods={moods} onSave={handleSave} onCancel={() => setFormState(null)} submitLabel={saving ? 'Saving…' : undefined} />
        </Modal>
      )}

      {entryToDelete && confirmDelete && (
        <ConfirmDialog title="Delete this entry?" message={`"${entryToDelete.title}" will be removed from your journal. This can't be undone.`} onConfirm={handleDelete} onCancel={() => setEntryToDelete(null)} />
      )}
    </DashboardLayout>
  );
}
