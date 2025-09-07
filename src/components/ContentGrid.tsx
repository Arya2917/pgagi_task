import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { reorderItems, setItems, setLoading } from '../features/contentFeed/contentFeedSlice';
import { useGetAllContentQuery } from '../services/contentApi';
import { ContentCard } from './ContentCard';
import { Button } from './ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

export function ContentGrid() {
  const dispatch = useAppDispatch();
  const { 
    filteredItems, 
    searchQuery, 
    isLoading: feedLoading 
  } = useAppSelector((state) => state.contentFeed);
  const { 
    enabledFeeds, 
    feedLayout, 
    itemsPerPage, 
    autoRefresh, 
    refreshInterval 
  } = useAppSelector((state) => state.userPreferences);

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: contentData,
    isLoading: apiLoading,
    error,
    refetch,
  } = useGetAllContentQuery(enabledFeeds, {
    refetchOnMountOrArgChange: true,
  });

  const isLoading = feedLoading || apiLoading;

  // Update store when data changes
  useEffect(() => {
    if (contentData) {
      dispatch(setItems(contentData));
    }
  }, [contentData, dispatch]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refetch();
      toast({
        title: "Content refreshed",
        description: "Your feed has been updated with the latest content.",
      });
    }, refreshInterval * 60 * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refetch]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading content",
        description: "Failed to load your personalized feed. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Pagination
  const displayedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(0, endIndex);
  }, [filteredItems, page, itemsPerPage]);

  const hasMore = displayedItems.length < filteredItems.length;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredItems.findIndex((item) => item.id === active.id);
      const newIndex = filteredItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(filteredItems, oldIndex, newIndex);
      dispatch(reorderItems(newItems));
      
      toast({
        title: "Content reordered",
        description: "Your feed order has been updated.",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast({
      title: "Refreshing content",
      description: "Fetching the latest updates for your feed...",
    });
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (isLoading && displayedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your personalized content...</p>
      </div>
    );
  }

  if (displayedItems.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No content found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No results found for "${searchQuery}"`
              : "Enable some content feeds in the sidebar to get started."
            }
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {searchQuery ? `Search Results (${filteredItems.length})` : 'Your Feed'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {displayedItems.length} of {filteredItems.length} items shown
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Content Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={displayedItems.map(item => item.id)}
          strategy={rectSortingStrategy}
        >
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={
              feedLayout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            <AnimatePresence>
              {displayedItems.map((item, index) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={loadMore}
            variant="outline"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}