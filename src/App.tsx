import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRoadmapStore } from './store/useRoadmapStore';
import { supabase } from './lib/supabase';
import { initializeData, subscribeToChanges, unsubscribeFromChanges } from './lib/supabase-sync';
import Layout from './components/layout/Layout';
import OverviewPage from './components/overview/OverviewPage';
import { RoadmapPage } from './components/roadmap/RoadmapPage';
import { DefinitionPage } from './components/definition/DefinitionPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { FeedbackPage } from './components/feedback/FeedbackPage';
import GoalsPage from './components/goals/GoalsPage';
import FocusPage from './components/focus/FocusPage';
import AnalysisLogPage from './components/analysis/AnalysisLogPage';
import { LoginPage } from './components/auth/LoginPage';
import { ErrorToast } from './components/shared/ErrorToast';

function App() {
  const activeSection = useRoadmapStore((state) => state.activeSection);
  const theme = useRoadmapStore((state) => state.theme);
  const isAuthenticated = useRoadmapStore((state) => state.isAuthenticated);
  const isLoading = useRoadmapStore((state) => state.isLoading);
  const setAuthenticated = useRoadmapStore((state) => state.setAuthenticated);
  const setCurrentUser = useRoadmapStore((state) => state.setCurrentUser);
  const setLoading = useRoadmapStore((state) => state.setLoading);

  // Auth initialization
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthenticated(true);
        setCurrentUser({ id: session.user.id, email: session.user.email! });
        initializeData();
        subscribeToChanges();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setAuthenticated(true);
          setCurrentUser({ id: session.user.id, email: session.user.email! });
          initializeData();
          subscribeToChanges();
        } else if (event === 'SIGNED_OUT') {
          setAuthenticated(false);
          setCurrentUser(null);
          unsubscribeFromChanges();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Apply theme class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-thai">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activeSection) {
      case 'overview': return <OverviewPage />;
      case 'goals': return <GoalsPage />;
      case 'roadmap': return <RoadmapPage />;
      case 'focus': return <FocusPage />;
      case 'analysis': return <AnalysisLogPage />;
      case 'definition': return <DefinitionPage />;
      case 'feedback': return <FeedbackPage />;
      case 'settings': return <SettingsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <ErrorToast />
    </Layout>
  );
}

export default App;
