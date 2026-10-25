import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Card from '../components/dashboard/Card.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import TaskForm from '../components/todo/TaskForm.jsx';
import TaskItem from '../components/todo/TaskItem.jsx';
import TaskFilters from '../components/todo/TaskFilters.jsx';
import DailyProgress from '../components/todo/DailyProgress.jsx';
import DateNav from '../components/todo/DateNav.jsx';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';
import { toDateInputValue } from '../utils/dates.js';
import { addDays, sortTasks } from '../utils/tasks.js';

const fromRow = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description ?? '',
  date: row.task_date,
  time: row.task_time ? String(row.task_time).slice(0, 5) : '',
  priority: row.priority ?? 'medium',
  completed: Boolean(row.completed),
});

export default function TodoPage() {
  const today = toDateInputValue();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [filter, setFilter] = useState('all');
  const [formKey, setFormKey] = useState(0);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!user?.id) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('todo_tasks')
      .select('id, user_id, title, description, task_date, task_time, priority, completed, created_at')
      .eq('user_id', user.id)
      .order('task_date', { ascending: true });
    if (fetchError) {
      setError(`Couldn't load your tasks. ${fetchError.message}`);
      setLoading(false);
      return;
    }
    setTasks((data ?? []).map(fromRow));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const dayTasks = useMemo(
    () => sortTasks(tasks.filter((task) => task.date === selectedDate)),
    [tasks, selectedDate],
  );
  const pending = dayTasks.filter((task) => !task.completed);
  const completed = dayTasks.filter((task) => task.completed);
  const counts = { all: dayTasks.length, pending: pending.length, completed: completed.length };
  const showPending = filter !== 'completed';
  const showCompleted = filter !== 'pending';

  const handleAdd = async (values) => {
    if (!user?.id) {
      setError('Please sign in to save tasks.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      user_id: user.id,
      title: values.title,
      description: values.description ?? '',
      task_date: values.date,
      task_time: values.time || null,
      priority: values.priority,
      completed: false,
    };
    const { data, error: insertError } = await supabase
      .from('todo_tasks')
      .insert(payload)
      .select('id, user_id, title, description, task_date, task_time, priority, completed, created_at')
      .single();
    if (insertError) {
      setError(`Couldn't save this task. ${insertError.message}`);
      setSaving(false);
      return;
    }
    setTasks((prev) => [...prev, fromRow(data)]);
    setSelectedDate(values.date);
    setFormKey((key) => key + 1);
    setSaving(false);
  };

  const handleEditSave = async (values) => {
    if (!editing || !user?.id) return;
    setSaving(true);
    setError('');
    const { data, error: updateError } = await supabase
      .from('todo_tasks')
      .update({
        title: values.title,
        description: values.description ?? '',
        task_date: values.date,
        task_time: values.time || null,
        priority: values.priority,
      })
      .eq('id', editing.id)
      .eq('user_id', user.id)
      .select('id, user_id, title, description, task_date, task_time, priority, completed, created_at')
      .single();
    if (updateError) {
      setError(`Couldn't update this task. ${updateError.message}`);
      setSaving(false);
      return;
    }
    setTasks((prev) => prev.map((task) => task.id === editing.id ? fromRow(data) : task));
    setSelectedDate(values.date);
    setEditing(null);
    setSaving(false);
  };

  const handleToggle = async (id) => {
    if (!user?.id) return;
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setError('');
    const { data, error: updateError } = await supabase
      .from('todo_tasks')
      .update({ completed: !task.completed })
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, user_id, title, description, task_date, task_time, priority, completed, created_at')
      .single();
    if (updateError) {
      setError(`Couldn't update task status. ${updateError.message}`);
      return;
    }
    setTasks((prev) => prev.map((item) => item.id === id ? fromRow(data) : item));
  };

  const handleDelete = async () => {
    if (!deleting || !user?.id) return;
    setSaving(true);
    setError('');
    const { error: deleteError } = await supabase
      .from('todo_tasks')
      .delete()
      .eq('id', deleting.id)
      .eq('user_id', user.id);
    if (deleteError) {
      setError(`Couldn't delete this task. ${deleteError.message}`);
      setSaving(false);
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== deleting.id));
    setDeleting(null);
    setSaving(false);
  };

  const renderList = (title, list, emptyText) => (
    <section aria-label={title}>
      <h2 className="mb-3 text-xl font-semibold">
        {title} <span className="text-base font-bold text-ink-500">({list.length})</span>
      </h2>
      {list.length > 0 ? (
        <ul className="space-y-3">
          {list.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={handleToggle} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl border border-white/80 bg-white/50 px-5 py-6 text-center text-sm text-ink-500">
          {emptyText}
        </p>
      )}
    </section>
  );

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header>
          <h1 className="text-3xl font-semibold sm:text-4xl">Daily To-Do ✅</h1>
          <p className="mt-2 text-ink-600">Small steps, one day at a time. Progress, not perfection.</p>
        </header>

        {error && (
          <div role="alert" className="mt-5 rounded-2xl border border-blush-300 bg-blush-100 px-4 py-3 text-sm text-ink-800">
            {error}
            <button type="button" className="ml-2 font-bold underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}
        {loading && (
          <p role="status" className="mt-5 rounded-2xl bg-white/60 px-4 py-3 text-sm text-ink-600">
            Loading your tasks…
          </p>
        )}

        <div className="mt-8 space-y-5">
          <DateNav
            date={selectedDate}
            today={today}
            onChange={setSelectedDate}
            onPrev={() => setSelectedDate((date) => addDays(date, -1))}
            onNext={() => setSelectedDate((date) => addDays(date, 1))}
          />
          <DailyProgress total={counts.all} completed={counts.completed} isFuture={selectedDate > today} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5 lg:items-start">
          <Card title="Add a task" subtitle="Keep it small and doable." className="lg:col-span-2">
            <TaskForm key={formKey} idPrefix="new-task" defaultDate={selectedDate} onSave={handleAdd} />
            {saving && <p role="status" className="mt-2 text-sm text-ink-500">Saving…</p>}
          </Card>

          <div className="space-y-6 lg:col-span-3">
            <TaskFilters value={filter} onChange={setFilter} counts={counts} />
            {loading ? null : counts.all === 0 ? (
              <div className="rounded-3xl border border-white/80 bg-white/60 px-6 py-14 text-center shadow-soft">
                <p className="text-4xl" aria-hidden="true">🌱</p>
                <h2 className="mt-3 text-xl font-semibold">Nothing planned for this day</h2>
                <p className="mx-auto mt-2 max-w-sm text-ink-600">
                  Add a task whenever you’re ready, or enjoy the open space.
                </p>
              </div>
            ) : (
              <>
                {showPending && renderList('Pending', pending, 'All caught up. Nothing pending 🌸')}
                {showCompleted && renderList('Completed', completed, 'Nothing completed yet. That’s okay, you’ve got time.')}
              </>
            )}
          </div>
        </div>
      </div>

      {editing && (
        <Modal title="Edit task" onClose={() => !saving && setEditing(null)}>
          <TaskForm
            task={editing}
            idPrefix="edit-task"
            defaultDate={selectedDate}
            onSave={handleEditSave}
            onCancel={() => setEditing(null)}
            submitLabel={saving ? 'Saving…' : 'Save changes'}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this task?"
          message={`"${deleting.title}" will be removed from your list. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => !saving && setDeleting(null)}
        />
      )}
    </DashboardLayout>
  );
}
