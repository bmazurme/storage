import { ThemeProvider } from '@gravity-ui/uikit';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { SearchResults } from './components/SearchResults';
import { WarehouseTree } from './components/WarehouseTree';
import { useSearch } from './hooks/useSearch';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { query, debouncedQuery, setDebouncedQuery } = useSearch();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main>
          {debouncedQuery.length >= 2 ? (
            <SearchResults query={debouncedQuery} />
          ) : (
            <WarehouseTree />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
