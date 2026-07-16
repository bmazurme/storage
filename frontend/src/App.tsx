import { ThemeProvider } from '@gravity-ui/uikit';
import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { SearchResults } from './components/SearchResults';
import { WarehouseTree } from './components/WarehouseTree';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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
          query={query}
          onQueryChange={setQuery}
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
