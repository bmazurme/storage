import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  debouncedQuery: string;
}

const initialState: SearchState = {
  query: '',
  debouncedQuery: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setDebouncedQuery: (state, action: PayloadAction<string>) => {
      state.debouncedQuery = action.payload;
    },
  },
});

export const { setQuery, setDebouncedQuery } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
