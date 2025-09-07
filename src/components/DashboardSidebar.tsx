import { 
  Home, 
  Newspaper, 
  Film, 
  Users, 
  Settings, 
  LayoutGrid, 
  List,
  RefreshCw 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setFeedLayout, 
  toggleFeed,
  setAutoRefresh 
} from '../features/userPreferences/userPreferencesSlice';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { DarkModeToggle } from './DarkModeToggle';
import { motion } from 'framer-motion';

interface DashboardSidebarProps {
  collapsed: boolean;
}

export function DashboardSidebar({ collapsed }: DashboardSidebarProps) {
  const dispatch = useAppDispatch();
  const { feedLayout, enabledFeeds, autoRefresh } = useAppSelector(
    (state) => state.userPreferences
  );

  const feedOptions = [
    { id: 'news', label: 'News', icon: Newspaper, color: 'text-primary' },
    { id: 'movies', label: 'Movies', icon: Film, color: 'text-accent' },
    { id: 'social', label: 'Social', icon: Users, color: 'text-success' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-sidebar border-r border-sidebar-border flex flex-col h-full"
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Home className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-bold text-lg text-sidebar-foreground">
                Dashboard
              </h1>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Layout Controls */}
        <div>
          {!collapsed && (
            <Label className="text-sm font-medium text-sidebar-foreground mb-3 block">
              Layout
            </Label>
          )}
          <div className={`flex gap-2 ${collapsed ? 'flex-col' : ''}`}>
            <Button
              variant={feedLayout === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => dispatch(setFeedLayout('grid'))}
              className={`${collapsed ? 'w-full justify-center' : 'flex-1'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Grid</span>}
            </Button>
            <Button
              variant={feedLayout === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => dispatch(setFeedLayout('list'))}
              className={`${collapsed ? 'w-full justify-center' : 'flex-1'}`}
            >
              <List className="h-4 w-4" />
              {!collapsed && <span className="ml-2">List</span>}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Feed Controls */}
        <div>
          {!collapsed && (
            <Label className="text-sm font-medium text-sidebar-foreground mb-3 block">
              Content Feeds
            </Label>
          )}
          <div className="space-y-2">
            {feedOptions.map((feed) => (
              <div
                key={feed.id}
                className={`flex items-center ${
                  collapsed ? 'justify-center' : 'justify-between'
                }`}
              >
                {!collapsed && (
                  <div className="flex items-center gap-2">
                    <feed.icon className={`h-4 w-4 ${feed.color}`} />
                    <Label className="text-sm text-sidebar-foreground">
                      {feed.label}
                    </Label>
                  </div>
                )}
                <Switch
                  checked={enabledFeeds.includes(feed.id)}
                  onCheckedChange={() => dispatch(toggleFeed(feed.id))}
                  className={collapsed ? 'scale-75' : ''}
                />
                {collapsed && (
                  <span className="sr-only">Toggle {feed.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Auto-refresh */}
        <div>
          <div className={`flex items-center ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-sidebar-foreground" />
                <Label className="text-sm text-sidebar-foreground">
                  Auto Refresh
                </Label>
              </div>
            )}
            <Switch
              checked={autoRefresh}
              onCheckedChange={(checked) => dispatch(setAutoRefresh(checked))}
              className={collapsed ? 'scale-75' : ''}
            />
            {collapsed && <span className="sr-only">Toggle Auto Refresh</span>}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center gap-2 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!collapsed && (
            <Button variant="ghost" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
          <DarkModeToggle />
        </div>
      </div>
    </motion.aside>
  );
}