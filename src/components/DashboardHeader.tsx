import { useState } from 'react';
import { Menu, Bell, UserCircle } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  onToggleSidebar: () => void;
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const [notifications] = useState(3); // Mock notification count

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="dashboard-header sticky top-0 z-40 h-16 px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 hover:bg-muted transition-smooth"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="hidden sm:block">
          <h2 className="text-xl font-semibold text-foreground">
            Welcome back!
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening in your personalized feed
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SearchBar />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 hover:bg-muted transition-smooth"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-xs rounded-full flex items-center justify-center"
              >
                {notifications}
              </motion.span>
            )}
            <span className="sr-only">Notifications ({notifications})</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-muted transition-smooth"
          >
            <UserCircle className="h-5 w-5" />
            <span className="sr-only">User menu</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}