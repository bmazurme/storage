import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleTheme as toggleThemeAction } from '../store/themeSlice';

export function useTheme() {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();

  const toggleTheme = () => dispatch(toggleThemeAction());

  return { theme, toggleTheme };
}
