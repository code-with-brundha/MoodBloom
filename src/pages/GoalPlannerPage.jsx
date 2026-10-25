import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import GoalForm from '../components/goals/GoalForm.jsx';
import GoalCard from '../components/goals/GoalCard.jsx';
import GoalStats from '../components/goals/GoalStats.jsx';
import GoalHighlights from '../components/goals/GoalHighlights.jsx';
import GoalFilters from '../components/goals/GoalFilters.jsx';
import GoalIcon from '../components/goals/GoalIcon.jsx';
import { toDateInputValue } from '../utils/dates.js';
import { getDeadline, getProgress, getStats, sortGoals, uid, normalizeGoal } from '../utils/goals.js';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';

const emptyTabText = {
  active: 'No active goals match these filters. Try “All categories” or add a new goal 🌷',
  completed: 'No completed goals here yet. Every finished goal will be celebrated in this space 🎉',
  archived: 'Nothing archived. Archive goals you want to pause without deleting them.',
};

export default function GoalPlannerPage() {
  const today = toDateInputValue();

  // Goals are loaded and saved per signed-in user in Supabase.
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [tab, setTab] = useState('active');
  const [category, setCategory] = useState('all');
  const [deadlineFilter, setDeadlineFilter] = useState('all');
  const [formState, setFormState] = useState(null); // null | { goal?: existing goal }
  const [deleting, setDeleting] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [notice, setNotice] = useState('');

  const fromRow = (row) => normalizeGoal({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    startDate: row.start_date,
    targetDate: row.target_date,
    status: row.status,
    milestones: row.milestones,
    linkedTasks: row.linked_tasks,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at,
  });

  const toRow = (goal) => ({
    user_id: user.id,
    title: goal.title,
    description: goal.description ?? '',
    category: goal.category,
    start_date: goal.startDate,
    target_date: goal.targetDate,
    status: goal.status,
    milestones: goal.milestones ?? [],
    linked_tasks: goal.linkedTasks ?? [],
    completed_at: goal.completedAt,
    archived_at: goal.archivedAt,
  });

  const loadGoalsFromCloud = useCallback(async () => {
    if (!user?.id) {
      setGoals([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSaveError('');
    const { data, error } = await supabase
      .from('goal_planner_goals')
      .select('id, user_id, title, description, category, start_date, target_date, status, milestones, linked_tasks, created_at, completed_at, archived_at')
      .eq('user_id', user.id)
      .order('target_date', { ascending: true });
    if (error) {
      setSaveError(`Couldn't load your goals. ${error.message}`);
      setLoading(false);
      return;
    }
    setGoals((data ?? []).map(fromRow).filter(Boolean));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadGoalsFromCloud();
  }, [loadGoalsFromCloud]);

  const persistGoal = async (goal) => {
    if (!user?.id) {
      setSaveError('Please sign in to save goals.');
      return false;
    }
    setSaving(true);
    setSaveError('');
    const { error } = await supabase
      .from('goal_planner_goals')
      .upsert({ id: goal.id, ...toRow(goal) }, { onConflict: 'id' });
    if (error) setSaveError(`Couldn't save your goal. ${error.message}`);
    setSaving(false);
    return !error;
  };

  const patchGoal = async (id, changes) => {
    const current = goals.find((g) => g.id === id);
    if (!current) return;
    const delta = typeof changes === 'function' ? changes(current) : changes;
    const updatedGoal = { ...current, ...delta };
    if (await persistGoal(updatedGoal)) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));
    }
  };

  // Friendly confirmation messages fade away on their own.
  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const stats = useMemo(() => getStats(goals, today), [goals, today]);
  const counts = { active: stats.active.length, completed: stats.completed.length, archived: stats.archived.length };

  const visible = useMemo(() => {
    let list = goals.filter((g) => g.status === tab);
    if (category !== 'all') list = list.filter((g) => g.category === category);
    if (tab === 'active' && deadlineFilter !== 'all') {
      list = list.filter((g) => {
        const d = getDeadline(g.targetDate, today);
        return deadlineFilter === 'overdue' ? d.state === 'overdue' : d.state !== 'overdue' && d.days <= 7;
      });
    }
    return sortGoals(list, tab);
  }, [goals, tab, category, deadlineFilter, today]);

  /* ----------------------------- goal actions ----------------------------- */

  const handleSave = async (values) => {
    if (formState.goal) {
      const updatedGoal = { ...formState.goal, ...values };
      if (await persistGoal(updatedGoal)) {
        setGoals((prev) => prev.map((g) => g.id === updatedGoal.id ? updatedGoal : g));
        setNotice('Goal updated 🌸');
        setFormState(null);
      }
    } else {
      const newGoal = {
        id: uid(),
        ...values,
        status: 'active',
        milestones: [],
        linkedTasks: [],
        createdAt: new Date().toISOString(),
        completedAt: null,
        archivedAt: null,
      };
      if (await persistGoal(newGoal)) {
        setGoals((prev) => [...prev, newGoal]);
        setTab('active');
        setCategory('all');
        setDeadlineFilter('all');
        setNotice('Goal created. Now add a few small steps 🌱');
        setFormState(null);
      }
    }
  };

  const finishComplete = async (goal) => {
    await patchGoal(goal.id, { status: 'completed', completedAt: new Date().toISOString(), archivedAt: null });
    setCompleting(null);
    setNotice(`“${goal.title}” completed. Well done! 🎉`);
  };

  const handleComplete = (goal) => {
    const { total, done } = getProgress(goal);
    // Only ask when steps are still open, so it never happens by accident.
    if (total > done) setCompleting(goal);
    else finishComplete(goal);
  };

  const handleArchive = async (goal) => {
    await patchGoal(goal.id, { status: 'archived', archivedAt: new Date().toISOString() });
    setNotice(`“${goal.title}” archived 📦`);
  };

  const handleReopen = async (goal) => {
    await patchGoal(goal.id, { status: 'active', completedAt: null, archivedAt: null });
    setNotice(`“${goal.title}” is active again 🌱`);
  };

  const handleDelete = async () => {
    if (!deleting || !user?.id) return;
    setSaving(true);
    setSaveError('');
    const { error } = await supabase.from('goal_planner_goals').delete()
      .eq('id', deleting.id).eq('user_id', user.id);
    if (error) {
      setSaveError(`Couldn't delete this goal. ${error.message}`);
      setSaving(false);
      return;
    }
    setGoals((prev) => prev.filter((g) => g.id !== deleting.id));
    setNotice('Goal deleted.');
    setDeleting(null);
    setSaving(false);
  };

  /* ---------------- milestones & linked tasks (progress is derived) ---------------- */

  const actions = {
    onEdit: (goal) => setFormState({ goal }),
    onDelete: setDeleting,
    onComplete: handleComplete,
    onArchive: handleArchive,
    onReopen: handleReopen,

    onAddMilestone: (goalId, title) =>
      patchGoal(goalId, (g) => ({ milestones: [...g.milestones, { id: uid(), title, completed: false }] })),
    onToggleMilestone: (goalId, id) =>
      patchGoal(goalId, (g) => ({ milestones: g.milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)) })),
    onEditMilestone: (goalId, id, title) =>
      patchGoal(goalId, (g) => ({ milestones: g.milestones.map((m) => (m.id === id ? { ...m, title } : m)) })),
    onDeleteMilestone: (goalId, id) =>
      patchGoal(goalId, (g) => ({ milestones: g.milestones.filter((m) => m.id !== id) })),

    // Linked tasks never touch milestones or goal status.
    onAddTask: (goalId, values) =>
      patchGoal(goalId, (g) => ({ linkedTasks: [...g.linkedTasks, { id: uid(), completed: false, ...values }] })),
    onToggleTask: (goalId, id) =>
      patchGoal(goalId, (g) => ({ linkedTasks: g.linkedTasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) })),
    onDeleteTask: (goalId, id) =>
      patchGoal(goalId, (g) => ({ linkedTasks: g.linkedTasks.filter((t) => t.id !== id) })),
  };

  const openNew = () => setFormState({});

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Goal Planner 🎯</h1>
            <p className="mt-2 text-ink-600">Dream big, start small. Gentle steps toward what matters to you.</p>
          </div>
          <Button type="button" onClick={openNew} className="py-2.5">
            <GoalIcon name="plus" className="h-5 w-5" /> New goal
          </Button>
        </header>

        <p aria-live="polite" className="mt-4 min-h-[1.5rem] text-sm font-bold text-lilac-500">
          {notice}
        </p>

        {saveError && (
          <p role="alert" className="mb-4 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-700">
            {saveError}
            <button type="button" className="ml-2 underline" onClick={() => setSaveError('')}>Dismiss</button>
          </p>
        )}
        {loading && <p role="status" className="mb-4 text-sm text-ink-500">Loading your goals…</p>}
        {saving && <p role="status" className="mb-4 text-sm text-ink-500">Saving your changes…</p>}

        {!loading && goals.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-white/80 bg-white/60 px-6 py-16 text-center shadow-soft">
            <p className="text-5xl" aria-hidden="true">
              🌷
            </p>
            <h2 className="mt-4 text-2xl font-semibold">Your garden of goals is waiting</h2>
            <p className="mx-auto mt-2 max-w-md text-ink-600">
              Start with one goal that feels exciting, then break it into small steps. You don’t need a perfect plan, just a
              first step.
            </p>
            <Button type="button" onClick={openNew} className="mt-6">
              <GoalIcon name="plus" className="h-5 w-5" /> Create your first goal
            </Button>
          </div>
        ) : !loading && goals.length > 0 ? (
          <div className="mt-2 space-y-6">
            <GoalStats stats={stats} />
            <GoalHighlights stats={stats} today={today} />

            <GoalFilters
              tab={tab}
              onTabChange={setTab}
              counts={counts}
              category={category}
              onCategoryChange={setCategory}
              deadline={deadlineFilter}
              onDeadlineChange={setDeadlineFilter}
            />

            <div id="goal-list" role="tabpanel" aria-labelledby={`goal-tab-${tab}`}>
              {visible.length === 0 ? (
                <p className="rounded-3xl border border-white/80 bg-white/50 px-5 py-10 text-center text-sm text-ink-500">
                  {emptyTabText[tab]}
                </p>
              ) : (
                <ul className="grid gap-5 lg:grid-cols-2 lg:items-start">
                  {visible.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} today={today} actions={actions} />
                  ))}
                </ul>
              )}
            </div>

          </div>
        ) : null }
      </div>

      {formState && (
        <Modal title={formState.goal ? 'Edit goal' : 'New goal'} onClose={() => setFormState(null)}>
          <GoalForm
            goal={formState.goal}
            idPrefix={formState.goal ? 'edit-goal' : 'new-goal'}
            onSave={handleSave}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this goal?"
          message={`"${deleting.title}", along with its steps and linked tasks, will be permanently removed. This can't be undone. If you only want to pause it, archive it instead.`}
          confirmLabel="Delete goal"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}

      {completing && (
        <Modal title="Mark as completed?" onClose={() => setCompleting(null)}>
          <p className="leading-relaxed text-ink-600">
            "{completing.title}" still has {completing.milestones.filter((m) => !m.completed).length} open{' '}
            {completing.milestones.filter((m) => !m.completed).length === 1 ? 'step' : 'steps'}. You can still mark it
            completed. Your steps stay exactly as they are.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setCompleting(null)} className="py-2.5">
              Not yet
            </Button>
            <Button type="button" onClick={() => finishComplete(completing)} className="py-2.5">
              Mark completed
            </Button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
