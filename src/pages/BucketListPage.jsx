import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/journal/Modal.jsx';
import ConfirmDialog from '../components/journal/ConfirmDialog.jsx';
import BucketForm from '../components/bucket/BucketForm.jsx';
import CompleteForm from '../components/bucket/CompleteForm.jsx';
import BucketCard from '../components/bucket/BucketCard.jsx';
import BucketStats from '../components/bucket/BucketStats.jsx';
import BucketFilters from '../components/bucket/BucketFilters.jsx';
import BucketIcon from '../components/bucket/BucketIcon.jsx';
import Celebration from '../components/bucket/Celebration.jsx';
import { toDateInputValue } from '../utils/dates.js';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';
import { getStats, ideas, sortItems, statusByKey } from '../utils/bucket.js';

const TABLE = 'bucket_list_items';

function fromRow(row) {
  return {
    ...(row.item_data || {}),
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    completedDate: row.completed_date || '',
    reflection: row.reflection || '',
    createdAt: row.created_at,
  };
}

function toRow(item, userId) {
  const { id, ...itemData } = item;
  return {
    ...(id ? { id } : {}),
    user_id: userId,
    title: item.title,
    category: item.category || 'other',
    status: item.status || 'planned',
    completed_date: item.completedDate || null,
    reflection: item.reflection || '',
    item_data: itemData,
  };
}

export default function BucketListPage() {
  const today = toDateInputValue();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [formState, setFormState] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState('');
  const [celebration, setCelebration] = useState(null);

  const loadItems = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      setLoadError(`Could not load your bucket list: ${error.message}`);
      setItems([]);
    } else {
      setItems((data || []).map(fromRow));
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (!notice) return undefined;
    const t = setTimeout(() => setNotice(''), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const stopCelebration = useCallback(() => setCelebration(null), []);
  const stats = useMemo(() => getStats(items), [items]);
  const counts = { all: stats.total, planned: stats.planned, inprogress: stats.inprogress, completed: stats.completed };

  const visible = useMemo(() => {
    let list = items;
    if (statusFilter !== 'all') list = list.filter((i) => i.status === statusFilter);
    if (categoryFilter !== 'all') list = list.filter((i) => i.category === categoryFilter);
    return sortItems(list, sort);
  }, [items, statusFilter, categoryFilter, sort]);

  const filtersActive = statusFilter !== 'all' || categoryFilter !== 'all';

  const persistItem = async (item) => {
    if (!user?.id) throw new Error('Please sign in to save your bucket list.');
    const payload = toRow(item, user.id);
    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();
    if (error) throw error;
    return fromRow(data);
  };

  const patchItem = async (id, changes) => {
    const current = items.find((item) => item.id === id);
    if (!current) return null;
    const updated = { ...current, ...changes };
    const saved = await persistItem(updated);
    setItems((prev) => prev.map((item) => item.id === id ? saved : item));
    return saved;
  };

  const celebrate = (id, title) => {
    setCelebration({ id, title });
    setNotice(`Dream achieved: “${title}” 🎉`);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      const completedValues = values.status === 'completed' ? values : { ...values, completedDate: '' };
      if (formState.item) {
        const wasCompleted = formState.item.status === 'completed';
        const saved = await persistItem({ ...formState.item, ...completedValues });
        setItems((prev) => prev.map((item) => item.id === saved.id ? saved : item));
        if (values.status === 'completed' && !wasCompleted) celebrate(saved.id, values.title);
        else setNotice('Dream updated 🌸');
      } else {
        const saved = await persistItem({ ...completedValues, createdAt: new Date().toISOString() });
        setItems((prev) => [saved, ...prev]);
        setStatusFilter('all');
        setCategoryFilter('all');
        if (values.status === 'completed') celebrate(saved.id, values.title);
        else setNotice('Dream added to your list 🌟');
      }
      setFormState(null);
    } catch (error) {
      setNotice(`Could not save dream: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (item, status) => {
    if (status === item.status) return;
    if (status === 'completed') {
      setCompleting({ item, mode: 'complete' });
      return;
    }
    setSaving(true);
    try {
      await patchItem(item.id, { status, completedDate: '' });
      setNotice(`“${item.title}” is now ${statusByKey[status].label.toLowerCase()} ${statusByKey[status].emoji}`);
    } catch (error) {
      setNotice(`Could not update dream: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteSave = async ({ completedDate, reflection }) => {
    const { item, mode } = completing;
    setSaving(true);
    try {
      await patchItem(item.id, { status: 'completed', completedDate, reflection });
      setCompleting(null);
      if (mode === 'complete') celebrate(item.id, item.title);
      else setNotice('Reflection saved 💭');
    } catch (error) {
      setNotice(`Could not save reflection: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id || !deleting) return;
    setSaving(true);
    const item = deleting;
    const { error } = await supabase.from(TABLE).delete().eq('id', item.id).eq('user_id', user.id);
    if (error) {
      setNotice(`Could not delete dream: ${error.message}`);
    } else {
      setItems((prev) => prev.filter((entry) => entry.id !== item.id));
      setNotice('Dream deleted.');
    }
    setDeleting(null);
    setSaving(false);
  };

  const openNew = (prefill) => setFormState({ prefill });
  const clearFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">Bucket List 🌟</h1>
            <p className="mt-2 text-ink-600">Dreams worth chasing. Add them, plan them, and celebrate every one.</p>
          </div>
          <Button type="button" onClick={() => openNew()} className="py-2.5">
            <BucketIcon name="plus" className="h-5 w-5" /> Add dream
          </Button>
        </header>

        <p aria-live="polite" className="mt-4 min-h-[1.5rem] text-sm font-bold text-lilac-500">{notice}</p>

        {loadError && (
          <p role="alert" className="mb-4 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-700">
            {loadError}
          </p>
        )}

        {loading ? (
          <div className="mt-6 rounded-3xl bg-white/70 p-8 text-center text-ink-600">Loading your dreams… 🌷</div>
        ) : items.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-white/80 bg-gradient-to-br from-blush-100/70 to-lilac-100/70 px-6 py-14 text-center shadow-soft">
            <p className="text-5xl" aria-hidden="true">🌠</p>
            <h2 className="mt-4 text-2xl font-semibold">What would make your life feel full?</h2>
            <p className="mx-auto mt-2 max-w-md text-ink-600">
              Your bucket list is a gentle place for the things you hope to see, learn, feel and become. Start with just
              one dream. It doesn’t have to be big or perfect.
            </p>
            <Button type="button" onClick={() => openNew()} className="mt-6">
              <BucketIcon name="plus" className="h-5 w-5" /> Add your first dream
            </Button>
            <div className="mx-auto mt-8 max-w-xl">
              <p className="text-sm font-bold text-ink-500">Need a spark? Try one of these</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {ideas.map((idea) => (
                  <button key={idea.title} type="button" onClick={() => openNew(idea)}
                    className="rounded-full border-2 border-transparent bg-white/80 px-4 py-2 text-sm font-bold text-ink-700 transition hover:-translate-y-0.5 hover:border-lilac-300 hover:bg-white">
                    {idea.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2 space-y-6">
            <BucketStats stats={stats} />
            <BucketFilters status={statusFilter} onStatusChange={setStatusFilter} counts={counts}
              category={categoryFilter} onCategoryChange={setCategoryFilter} sort={sort} onSortChange={setSort} />
            {visible.length === 0 ? (
              <div className="rounded-3xl border border-white/80 bg-white/50 px-5 py-10 text-center">
                <p className="text-3xl" aria-hidden="true">🔎</p>
                <p className="mt-2 font-semibold text-ink-700">No dreams match these filters.</p>
                <p className="mt-1 text-sm text-ink-500">Try a different status or category.</p>
                {filtersActive && <Button type="button" variant="secondary" onClick={clearFilters} className="mt-4 py-2 text-sm">Clear filters</Button>}
              </div>
            ) : (
              <ul className="grid gap-5 md:grid-cols-2 md:items-start">
                {visible.map((item) => (
                  <BucketCard key={item.id} item={item} today={today}
                    celebrating={celebration?.id === item.id} onStatusChange={handleStatusChange}
                    onEdit={(it) => setFormState({ item: it })} onDelete={setDeleting}
                    onReflect={(it) => setCompleting({ item: it, mode: 'reflect' })} />
                ))}
              </ul>
            )}
            <p className="text-center text-xs text-ink-500">Your dreams are securely saved to your MoodBloom account.</p>
          </div>
        )}
      </div>

      {formState && (
        <Modal title={formState.item ? 'Edit dream' : 'Add a dream'} onClose={() => setFormState(null)}>
          <BucketForm item={formState.item} prefill={formState.prefill}
            idPrefix={formState.item ? 'edit-dream' : 'new-dream'} onSave={handleSave} onCancel={() => setFormState(null)} />
          {saving && <p className="mt-3 text-sm text-ink-500">Saving your dream…</p>}
        </Modal>
      )}

      {completing && (
        <Modal title={completing.mode === 'complete' ? 'Dream achieved! 🎉' : 'Reflection & memory'} onClose={() => setCompleting(null)}>
          <CompleteForm item={completing.item}
            submitLabel={completing.mode === 'complete' ? 'Mark as completed' : 'Save reflection'}
            onSave={handleCompleteSave} onCancel={() => setCompleting(null)} />
          {saving && <p className="mt-3 text-sm text-ink-500">Saving…</p>}
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog title="Delete this dream?"
          message={`"${deleting.title}" will be permanently removed from your bucket list, along with its notes and reflection. This can't be undone.`}
          confirmLabel="Delete dream" onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
      )}
      {celebration && <Celebration key={celebration.id + celebration.title} title={celebration.title} onDone={stopCelebration} />}
    </DashboardLayout>
  );
}
