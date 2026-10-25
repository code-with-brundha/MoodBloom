import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Card from '../components/dashboard/Card.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import PlannerHeader from '../components/planner/PlannerHeader.jsx';
import TypeFilters from '../components/planner/TypeFilters.jsx';
import WeekView from '../components/planner/WeekView.jsx';
import MonthView from '../components/planner/MonthView.jsx';
import DayAgenda from '../components/planner/DayAgenda.jsx';
import PlanForm from '../components/planner/PlanForm.jsx';
import PlannerIcon from '../components/planner/PlannerIcon.jsx';
import { groupByDate } from '../utils/calendar.js';
import { addDays } from '../utils/tasks.js';
import { toDateInputValue } from '../utils/dates.js';
import {
  addMonths,
  fullDateLabel,
  monthTitle,
  plural,
  sortEvents,
  uid,
  weekKeys,
  weekTitle,
} from '../utils/planner.js';

function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    type: row.type ?? 'personal',
    date: row.event_date,
    startTime: row.start_time ? String(row.start_time).slice(0, 5) : '',
    endTime: row.end_time ? String(row.end_time).slice(0, 5) : '',
    reminder: row.reminder ?? '',
    createdAt: row.created_at,
  };
}

function toRow(event, userId) {
  return {
    ...(event.id ? { id: event.id } : {}),
    user_id: userId,
    title: event.title,
    description: event.description ?? '',
    type: event.type ?? 'personal',
    event_date: event.date,
    start_time: event.startTime || null,
    end_time: event.endTime || null,
    reminder: event.reminder ?? '',
  };
}

export default function PlannerPage() {
  const todayKey = toDateInputValue();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveFailed, setSaveFailed] = useState(false);
  const [view, setView] = useState('week'); // 'week' | 'month'
  const [selectedKey, setSelectedKey] = useState(todayKey);
  const [typeFilter, setTypeFilter] = useState('all');
  const [formState, setFormState] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');
  const agendaRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadCloudEvents() {
      if (!user?.id) {
        if (active) {
          setEvents([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setSaveFailed(false);
      const { data, error } = await supabase
        .from('planner_events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (!active) return;

      if (error) {
        console.error('Unable to load planner events:', error);
        setSaveFailed(true);
        setNotice(`Couldn't load your plans: ${error.message}`);
        setEvents([]);
      } else {
        setEvents((data ?? []).map(fromRow));
      }
      setLoading(false);
    }

    loadCloudEvents();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const eventsByDate = useMemo(() => {
    const visible = typeFilter === 'all' ? events : events.filter((e) => e.type === typeFilter);
    const groups = groupByDate(visible);
    Object.keys(groups).forEach((k) => {
      groups[k] = sortEvents(groups[k]);
    });
    return groups;
  }, [events, typeFilter]);

  const dayPlans = eventsByDate[selectedKey] ?? [];
  const dayHidden = events.filter((e) => e.date === selectedKey).length - dayPlans.length;

  const periodCount = useMemo(() => {
    if (view === 'week') return weekKeys(selectedKey).reduce((n, k) => n + (eventsByDate[k]?.length ?? 0), 0);
    const month = selectedKey.slice(0, 7);
    return Object.keys(eventsByDate)
      .filter((k) => k.startsWith(month))
      .reduce((n, k) => n + eventsByDate[k].length, 0);
  }, [view, selectedKey, eventsByDate]);

  const step = (dir) => setSelectedKey((k) => (view === 'week' ? addDays(k, 7 * dir) : addMonths(k, dir)));

  const handleSelect = (key) => {
    setSelectedKey(key);
    requestAnimationFrame(() => {
      const el = agendaRef.current;
      if (el && el.getBoundingClientRect().top > window.innerHeight * 0.7) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  const handleSave = async (values) => {
    if (!user?.id) {
      setSaveFailed(true);
      setNotice('Please sign in to save your plans.');
      return;
    }

    setSaveFailed(false);
    const editing = Boolean(formState?.plan?.id);
    const payload = toRow({ ...(formState?.plan ?? {}), ...values, ...(editing ? { id: formState.plan.id } : {}) }, user.id);

    const { data, error } = editing
      ? await supabase.from('planner_events').update(payload).eq('id', formState.plan.id).eq('user_id', user.id).select('*').single()
      : await supabase.from('planner_events').insert(payload).select('*').single();

    if (error) {
      console.error('Unable to save planner event:', error);
      setSaveFailed(true);
      setNotice(`Couldn't save this plan: ${error.message}`);
      return;
    }

    const savedEvent = fromRow(data);
    setEvents((prev) => editing
      ? prev.map((e) => (e.id === savedEvent.id ? savedEvent : e))
      : [...prev, savedEvent]);
    setSelectedKey(savedEvent.date);
    setFormState(null);
    setNotice(editing ? 'Plan updated 🌸' : 'Plan added 🌱');
  };

  const handleDelete = async () => {
    if (!deleting?.id || !user?.id) return;

    setSaveFailed(false);
    const { error } = await supabase
      .from('planner_events')
      .delete()
      .eq('id', deleting.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Unable to delete planner event:', error);
      setSaveFailed(true);
      setNotice(`Couldn't delete this plan: ${error.message}`);
      setDeleting(null);
      return;
    }

    setEvents((prev) => prev.filter((e) => e.id !== deleting.id));
    setNotice('Plan deleted.');
    setDeleting(null);
  };

  const openNew = (date) => setFormState({ date });

  const title = view === 'week' ? weekTitle(selectedKey) : monthTitle(selectedKey);
  const summary = `${plural(periodCount, 'plan')} ${view === 'week' ? 'this week' : 'this month'}${
    typeFilter !== 'all' ? ' (filtered)' : ''
  }`;

  const agenda = (
    <div ref={agendaRef} className="scroll-mt-20">
      <DayAgenda
        dateKey={selectedKey}
        todayKey={todayKey}
        plans={dayPlans}
        typeFilter={typeFilter}
        hiddenCount={dayHidden}
        onAdd={openNew}
        onEdit={(plan) => setFormState({ plan })}
        onDelete={setDeleting}
        onClearFilter={() => setTypeFilter('all')}
      />
    </div>
  );

  const planner = (
    <Card className={view === 'month' ? 'lg:col-span-3' : ''}>
      <PlannerHeader
        view={view}
        onViewChange={setView}
        title={title}
        summary={summary}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        onToday={() => setSelectedKey(todayKey)}
      />
      <div className="mt-4">
        <TypeFilters value={typeFilter} onChange={setTypeFilter} />
      </div>
      <div className="mt-5">
        {view === 'week' ? (
          <WeekView selectedKey={selectedKey} todayKey={todayKey} eventsByDate={eventsByDate} onSelect={handleSelect} onAdd={openNew} />
        ) : (
          <MonthView selectedKey={selectedKey} todayKey={todayKey} eventsByDate={eventsByDate} onSelect={handleSelect} />
        )}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-ink-500 sm:text-sm">
        <span className="h-3 w-3 shrink-0 rounded-full bg-gradient-to-br from-blush-300 to-lilac-300" aria-hidden="true" />
        Today · Tap any date to see or add its plans
      </p>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Weekly &amp; Monthly Planner 📆</h1>
            <p className="mt-2 text-ink-600">Plan your days gently, and leave room to breathe.</p>
          </div>
          <Button type="button" onClick={() => openNew(selectedKey)} className="py-2.5">
            <PlannerIcon name="plus" className="h-5 w-5" /> Add plan
          </Button>
        </header>

        <p aria-live="polite" className="mt-4 min-h-[1.5rem] text-sm font-bold text-lilac-500">
          {loading ? 'Loading your plans…' : notice}
        </p>

        {saveFailed && (
          <p role="alert" className="mb-4 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-700">
            Your plans could not be saved or loaded from the cloud. Please check the error message above.
          </p>
        )}

        {view === 'month' ? (
          <div className="mt-2 grid gap-6 lg:grid-cols-5 lg:items-start">
            {planner}
            <div className="lg:col-span-2">{agenda}</div>
          </div>
        ) : (
          <div className="mt-2 space-y-6">
            {planner}
            {agenda}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-ink-500">
          {loading ? 'Loading plans from your account…' : 'Your plans are saved securely to your MoodBloom account.'}
        </p>
      </div>

      {formState && (
        <Modal
          title={formState.plan ? 'Edit plan' : `New plan · ${fullDateLabel(formState.date)}`}
          onClose={() => setFormState(null)}
        >
          <PlanForm
            plan={formState.plan}
            defaultDate={formState.date}
            idPrefix={formState.plan ? 'edit-plan' : 'new-plan'}
            onSave={handleSave}
            onCancel={() => setFormState(null)}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this plan?"
          message={`"${deleting.title}" will be removed from your planner. This can't be undone.`}
          confirmLabel="Delete plan"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </DashboardLayout>
  );
}
