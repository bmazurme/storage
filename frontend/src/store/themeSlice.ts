import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

const initialState: Theme = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) ?? 'light';

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => (state === 'light' ? 'dark' : 'light'),
  },
});

export const { toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

export function persistTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
