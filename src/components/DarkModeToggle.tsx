import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleDarkMode } from '../features/userPreferences/userPreferencesSlice';
import { Button } from './ui/button';
import { useEffect } from 'react';

export function DarkModeToggle() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.userPreferences.darkMode);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => dispatch(toggleDarkMode())}
      className="w-9 h-9 p-0 hover:bg-sidebar-accent transition-smooth"
    >
      {darkMode ? (
        <Sun className="h-4 w-4 text-accent transition-smooth" />
      ) : (
        <Moon className="h-4 w-4 text-sidebar-foreground transition-smooth" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
}