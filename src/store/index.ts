import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import userPreferencesReducer from '../features/userPreferences/userPreferencesSlice';
import contentFeedReducer from '../features/contentFeed/contentFeedSlice';
import { contentApi } from '../services/contentApi';

const rootReducer = combineReducers({
  userPreferences: userPreferencesReducer,
  contentFeed: contentFeedReducer,
  [contentApi.reducerPath]: contentApi.reducer,
});

const persistConfig: PersistConfig<ReturnType<typeof rootReducer>> = {
  key: 'personalized-dashboard',
  storage,
  whitelist: ['userPreferences'], // Only persist user preferences
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(contentApi.middleware) as any,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;