import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  author?: string;
  publishedAt: string;
  score?: number;
  category?: string;
}

export interface ContentFeedState {
  items: ContentItem[];
  searchQuery: string;
  filteredItems: ContentItem[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: ContentFeedState = {
  items: [],
  searchQuery: '',
  filteredItems: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const contentFeedSlice = createSlice({
  name: 'contentFeed',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Filter items based on search query
      if (action.payload.trim() === '') {
        state.filteredItems = state.items;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredItems = state.items.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      }
    },
    setItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      // Apply current search filter
      if (state.searchQuery.trim() === '') {
        state.filteredItems = action.payload;
      } else {
        const query = state.searchQuery.toLowerCase();
        state.filteredItems = action.payload.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      }
      state.lastUpdated = new Date().toISOString();
    },
    addItems: (state, action: PayloadAction<ContentItem[]>) => {
      const newItems = action.payload.filter(
        newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
      
      // Reapply search filter
      if (state.searchQuery.trim() === '') {
        state.filteredItems = state.items;
      } else {
        const query = state.searchQuery.toLowerCase();
        state.filteredItems = state.items.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      }
    },
    reorderItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      // Reapply search filter to maintain consistency
      if (state.searchQuery.trim() === '') {
        state.filteredItems = action.payload;
      } else {
        const query = state.searchQuery.toLowerCase();
        state.filteredItems = action.payload.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.author?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        );
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSearchQuery,
  setItems,
  addItems,
  reorderItems,
  setLoading,
  setError,
  clearError,
} = contentFeedSlice.actions;

export default contentFeedSlice.reducer;