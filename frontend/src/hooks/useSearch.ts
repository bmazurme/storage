import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import {
  setDebouncedQuery as setDebouncedQueryAction,
  setQuery as setQueryAction,
} from '../store/searchSlice';

export function useSearch() {
  const query = useSelector((state: RootState) => state.search.query);
  const debouncedQuery = useSelector((state: RootState) => state.search.debouncedQuery);
  const dispatch = useDispatch<AppDispatch>();

  const setQuery = (value: string) => dispatch(setQueryAction(value));
  const setDebouncedQuery = (value: string) => dispatch(setDebouncedQueryAction(value));

  return { query, setQuery, debouncedQuery, setDebouncedQuery };
}
