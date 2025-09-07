import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSearchQuery } from '../features/contentFeed/contentFeedSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.contentFeed.searchQuery);

  const handleSearch = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const clearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  return (
    <div className="relative flex-1 max-w-lg">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search across all content..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 pr-10 search-input bg-background/60 backdrop-blur-sm"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}