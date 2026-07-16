import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api';
import { searchReducer } from './searchSlice';
import { persistTheme, themeReducer } from './themeSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    theme: themeReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

store.subscribe(() => {
  persistTheme(store.getState().theme);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
