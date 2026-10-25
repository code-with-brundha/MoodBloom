import { useCallback, useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout.jsx';
import Card from '../components/dashboard/Card.jsx';
import PeriodNav from '../components/mood/PeriodNav.jsx';
import ViewToggle from '../components/insights/ViewToggle.jsx';
import InsightsSummary from '../components/insights/InsightsSummary.jsx';
import StatCard from '../components/insights/StatCard.jsx';
import MoodTrendChart from '../components/insights/MoodTrendChart.jsx';
import MoodDistribution from '../components/insights/MoodDistribution.jsx';
import PositiveHighlights from '../components/insights/PositiveHighlights.jsx';
import ReflectionPrompts from '../components/insights/ReflectionPrompts.jsx';
import { moods } from '../data/sampleData.js';
import { supabase } from '../lib/supabaseClient.js';
import { useAuth } from '../auth/useAuth.js';
import { buildHighlights, buildInsights, getPromptPool, scoreLabel } from '../utils/insights.js';
import { reachesToday, shiftAnchor } from '../utils/moodPeriods.js';

const VIEWS = [
  { key: 'week', label: 'Weekly' },
  { key: 'month', label: 'Monthly' },
];
const TREND_HINT = { up: '↑ brighter than', down: '↓ lower than', steady: '→ steady vs' };

const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));

export default function MoodInsightsPage() {
  const [view, setView] = useState('week');
  const [anchor, setAnchor] = useState(() => new Date());
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    if (!user?.id) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    const { data, error: fetchError } = await supabase
      .from('mood_logs')
      .select('id, user_id, log_date, mood, note, created_at')
      .eq('user_id', user.id)
      .order('log_date', { ascending: true })
      .order('created_at', { ascending: true });

    if (fetchError) {
      setError(`Couldn't load your mood insights. ${fetchError.message}`);
      setLoading(false);
      return;
    }

    setLogs((data ?? []).map((row) => ({
      id: row.id,
      date: row.log_date,
      mood: row.mood,
      note: row.note ?? '',
    })));
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const insights = useMemo(() => buildInsights(logs, view, anchor), [logs, view, anchor]);
  const highlights = useMemo(() => buildHighlights(insights, moodByKey), [insights]);
  const promptPool = useMemo(() => getPromptPool(insights), [insights]);

  const period = view === 'week' ? 'week' : 'month';
  const topMood = insights.top ? moodByKey[insights.top.mood] : null;
  const entryDiff = insights.total - insights.previousTotal;

  return (
    <DashboardLayout>
      <div className="animate-rise">
        <header>
          <h1 className="text-3xl font-semibold sm:text-4xl">Mood Insights ✨</h1>
          <p className="mt-2 text-ink-600">Spot patterns in how you feel, one gentle look at a time.</p>
        </header>

        {error && (
          <div role="alert" className="mt-5 rounded-2xl border border-blush-300 bg-blush-100 px-4 py-3 text-sm text-ink-800">
            {error}
            <button type="button" className="ml-2 font-bold underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}
        {loading && <p role="status" className="mt-4 text-sm text-ink-500">Loading your mood insights…</p>}

        <div className="mt-8 space-y-6">
          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <ViewToggle value={view} onChange={setView} options={VIEWS} label="Insights period" />
              <PeriodNav
                label={insights.range.label}
                onPrev={() => setAnchor((a) => shiftAnchor(view, a, -1))}
                onNext={() => setAnchor((a) => shiftAnchor(view, a, 1))}
                nextDisabled={reachesToday(insights.range)}
              />
            </div>
          </Card>

          <InsightsSummary insights={insights} moodByKey={moodByKey} />

          <section aria-label="Key numbers" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              emoji="📝"
              label="Total entries"
              value={insights.total}
              hint={
                insights.previousTotal || insights.total
                  ? `${entryDiff === 0 ? 'Same as' : `${entryDiff > 0 ? '+' : ''}${entryDiff} vs`} last ${period}`
                  : `None this ${period}`
              }
            />
            <StatCard
              emoji={topMood ? topMood.emoji : '🌱'}
              label="Most common mood"
              value={topMood ? topMood.label : '—'}
              hint={topMood ? `${insights.top.count}× · ${insights.top.share}% of entries` : 'Log a mood to see it'}
            />
            <StatCard
              emoji="🌈"
              label="Average mood"
              value={scoreLabel(insights.score)}
              hint={
                insights.trend ? `${TREND_HINT[insights.trend]} last ${period}` : insights.score === null ? '—' : 'First data to compare'
              }
            />
            <StatCard
              emoji="🌼"
              label="Positive days"
              value={`${insights.positiveDayCount} / ${insights.loggedDayCount}`}
              hint="Calm or brighter days"
            />
          </section>

          <MoodTrendChart days={insights.days} view={view} moodByKey={moodByKey} />

          <div className="grid gap-6 lg:grid-cols-2">
            <MoodDistribution ranked={insights.ranked} moodByKey={moodByKey} />
            <PositiveHighlights
              highlights={highlights}
              brightMoments={insights.brightMoments}
              moodByKey={moodByKey}
            />
          </div>

          <ReflectionPrompts key={`${view}-${insights.top?.mood ?? 'none'}`} pool={promptPool} />
        </div>
      </div>
    </DashboardLayout>
  );
}
