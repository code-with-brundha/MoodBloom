import { useState } from 'react';
import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import { useAuth } from '../../auth/useAuth.js';
import { supabase } from '../../lib/supabaseClient.js';

/** Exports rows owned by the currently authenticated user from the live Supabase database. */
export default function CloudExportCard() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const tables = ['journal_entries', 'mood_logs', 'goal_planner_goals', 'todo_tasks', 'planner_events', 'bucket_list_items', 'user_settings'];

  const exportCloudData = async () => {
    if (!user?.id || busy) return;
    setBusy(true);
    setStatus(null);
    try {
      const data = {};
      for (const table of tables) {
        const { data: rows, error } = await supabase.from(table).select('*').eq('user_id', user.id);
        if (error) throw new Error(`Could not export ${table}: ${error.message}`);
        data[table] = rows ?? [];
      }
      const payload = {
        app: 'MoodBloom',
        formatVersion: 1,
        exportedAt: new Date().toISOString(),
        source: 'Supabase account data for the currently signed-in user',
        user: { id: user.id, email: user.email ?? null },
        data,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `moodbloom-cloud-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus({ type: 'success', text: 'Your account data export was downloaded.' });
    } catch (error) {
      setStatus({ type: 'error', text: error?.message || 'Export failed. No data was changed.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Export account data" subtitle="Download records currently stored in your MoodBloom Supabase account.">
      <p className="mb-4 text-sm leading-relaxed text-ink-600">
        Exports your own rows from the journal, mood tracker, goals, tasks, planner, bucket list, and settings tables.
        The export requires access to each table; if a table cannot be read, the download will not be created.
      </p>
      <Button type="button" onClick={exportCloudData} disabled={!user?.id || busy} className="py-2.5">
        {busy ? 'Preparing export…' : 'Export account data (JSON)'}
      </Button>
      {status && <p role={status.type === 'error' ? 'alert' : 'status'} className={`mt-3 text-sm font-semibold ${status.type === 'error' ? 'text-blush-500' : 'text-lilac-600'}`}>{status.text}</p>}
    </Card>
  );
}
