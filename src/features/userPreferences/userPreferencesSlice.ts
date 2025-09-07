import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  darkMode: boolean;
  feedLayout: 'grid' | 'list';
  enabledFeeds: string[];
  feedOrder: string[];
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number; // in minutes
}

const initialState: UserPreferences = {
  darkMode: false, // Will be overridden by system preference
  feedLayout: 'grid',
  enabledFeeds: ['news', 'movies', 'social'],
  feedOrder: ['news', 'movies', 'social'],
  itemsPerPage: 12,
  autoRefresh: true,
  refreshInterval: 5,
};

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setFeedLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.feedLayout = action.payload;
    },
    toggleFeed: (state, action: PayloadAction<string>) => {
      const feed = action.payload;
      if (state.enabledFeeds.includes(feed)) {
        state.enabledFeeds = state.enabledFeeds.filter(f => f !== feed);
        state.feedOrder = state.feedOrder.filter(f => f !== feed);
      } else {
        state.enabledFeeds.push(feed);
        state.feedOrder.push(feed);
      }
    },
    reorderFeeds: (state, action: PayloadAction<string[]>) => {
      state.feedOrder = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  setFeedLayout,
  toggleFeed,
  reorderFeeds,
  setItemsPerPage,
  setAutoRefresh,
  setRefreshInterval,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;