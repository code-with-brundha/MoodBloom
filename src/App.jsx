import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import MoodTrackerPage from './pages/MoodTrackerPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import MoodInsightsPage from './pages/MoodInsightsPage.jsx';
import TodoPage from './pages/TodoPage.jsx';
import GoalPlannerPage from './pages/GoalPlannerPage.jsx';
import PlannerPage from './pages/PlannerPage.jsx';
import BucketListPage from './pages/BucketListPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/mood-tracker" element={<MoodTrackerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/mood-insights" element={<MoodInsightsPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/goals" element={<GoalPlannerPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/bucket-list" element={<BucketListPage />} />
        <Route path="/settings" element={<Navigate to="/settings/profile" replace />} />
        <Route path="/settings/:section" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
