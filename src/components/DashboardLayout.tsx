import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { ContentGrid } from './ContentGrid';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setDarkMode } from '../features/userPreferences/userPreferencesSlice';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.userPreferences.darkMode);

  // Initialize dark mode based on system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial dark mode based on system preference if not set by user
    if (!localStorage.getItem('persist:personalized-dashboard')) {
      dispatch(setDarkMode(mediaQuery.matches));
    }

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set preference
      const persistedState = localStorage.getItem('persist:personalized-dashboard');
      if (!persistedState) {
        dispatch(setDarkMode(e.matches));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex">
      <DashboardSidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <ContentGrid />
          </motion.div>
        </main>
      </div>
    </div>
  );
}